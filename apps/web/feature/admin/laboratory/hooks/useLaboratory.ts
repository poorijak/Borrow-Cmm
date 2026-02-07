import api from "@/lib/axios";
import { LaboratoryFormValue, LaboratoryRequest } from "@repo/schemas";
import {
  ActiveStatus,
  LaboratoryResponse,
  uploadImageResponse,
} from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface updateStatusValue {
  id: string;
  newStatus: ActiveStatus;
}

export const useMutateLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (laboratoryData: LaboratoryFormValue) => {
      let imageKey = laboratoryData.imageKey;

      if (laboratoryData.imageFile) {
        const formData = new FormData();
        formData.append("file", laboratoryData.imageFile);

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

      const payload: LaboratoryRequest = {
        name: laboratoryData.name,
        labCode: laboratoryData.labCode,
        imageKey,
        labId: laboratoryData.labId,
        status: laboratoryData.status,
      };

      const { data } = laboratoryData.labId
        ? await api.patch(`/laboratory/${laboratoryData.labId}`, payload)
        : await api.post("/laboratory", payload);

      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.labId
          ? "แก้ไขห้องปฏิบัติการสำเร็จ"
          : "เพิ่มห้องปฏิบัติการใหม่สำเร็จ",
      );
      queryClient.invalidateQueries({ queryKey: ["laboratory"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};

export const useLaboratory = (
  stauts?: string,
  search?: string,
  page?: number,
  limit?: number,
) => {
  return useQuery({
    queryKey: ["laboratory", stauts, search, page, limit],
    queryFn: async ({ queryKey }) => {
      const [_, status, search, page, limit] = queryKey as [
        "laboratory",
        ActiveStatus,
        string,
        number,
        number,
      ];

      const { data } = await api.get<LaboratoryResponse>("/laboratory/admin", {
        params: { status, page, limit, search },
      });
      return data;
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    updateStatusValue,
    {
      prevLaboratory: [
        queryKey: readonly unknown[],
        data: LaboratoryResponse | undefined,
      ][];
    }
  >({
    mutationFn: async ({ id, newStatus }) => {
      const { data } = await api.patch(`/laboratory/${id}/status`, {
        status: newStatus,
      });

      return data;
    },
    onMutate: async (variables, context) => {
      await queryClient.cancelQueries({ queryKey: ["laboratory"] });

      const prevLaboratory = queryClient.getQueriesData<LaboratoryResponse>({
        queryKey: ["laboratory"],
      });

      queryClient.setQueriesData<LaboratoryResponse>(
        { queryKey: ["laboratory"] },
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

      return { prevLaboratory };
    },
    onError: (error, variables, context) => {
      if (context?.prevLaboratory) {
        context.prevLaboratory.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
      toast.error(error.message || "เกิดข้อผิดพลาดจาก");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratory"] });
    },
  });
};

export const useDeleteLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | undefined) => {
      const { data } = await api.delete(`/laboratory/${id}`);

      return data;
    },
    onSuccess: () => {
      toast.success("ลบห้องปฎิบัติการสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["laboratory"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};
