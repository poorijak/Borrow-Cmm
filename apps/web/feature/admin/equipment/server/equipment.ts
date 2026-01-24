import api from "@/lib/axios";
import { EquipmentFormValue, EquipmentRequest } from "@repo/schemas";
import {
  ActiveStatus,
  EquipmentResponse,
  uploadImageResponse,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { time } from "console";
import { AwardIcon } from "lucide-react";
import { toast } from "sonner";

interface UpdateStatusValue {
  id: string;
  newStatus: ActiveStatus;
}

export const upsertEquipment = async (equipmentData: EquipmentFormValue) => {
  let imageKey = equipmentData.imageKey;

  if (equipmentData.imageFile) {
    const formData = new FormData();
    formData.append("file", equipmentData.imageFile);

    const { data: uploadRes } = await api.post<uploadImageResponse>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      },
    );

    imageKey = uploadRes.key;
  }

  if (!imageKey) {
    throw new Error("Image key is require");
  }

  const payload: EquipmentRequest = {
    title: equipmentData.title,
    description: equipmentData.description,
    subCategoryId: equipmentData.subCategoryId,
    totalStock: equipmentData.totalStock,
    status : equipmentData.status,
    imageKey,
    mainCategoryId: equipmentData.mainCategoryId,
  };

  const { data } = equipmentData.eqiupmentId
    ? await api.patch(`equipment/${equipmentData.eqiupmentId}`, payload)
    : await api.post("equipment", payload);

  return data;
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    UpdateStatusValue,
    {
      prevEquipment: [
        queryKey: readonly unknown[],
        data: EquipmentResponse | undefined,
      ][];
    }
  >({
    mutationFn: async ({ id, newStatus }) => {
      const { data } = await api.patch(`/equipment/${id}/status`, {
        status: newStatus,
      });
      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["equipment"] });

      const prevEquipment = queryClient.getQueriesData<EquipmentResponse>({
        queryKey: ["equipment"],
      });

      queryClient.setQueriesData<EquipmentResponse>(
        { queryKey: ["equipment"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === variables.id
                ? { ...item, status: variables.newStatus }
                : item,
            ),
          };
        },
      );

      return { prevEquipment };
    },
    onError: (error, variables, context) => {
      if (context?.prevEquipment) {
        context.prevEquipment.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
      toast.error(error.message || "เกิดข้อผิดพลาดจาก");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
