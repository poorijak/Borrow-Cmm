import { EquipmentFormValue } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertEquipment } from "../server/equipment";
import { toast } from "sonner";
import { ActiveStatus, EquipmentResponse, QuerySortType } from "@repo/types";
import api from "@/lib/axios";

export const useEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EquipmentFormValue) => upsertEquipment(data),
    onSuccess: () => {
      toast.success("เพิ่มอุปกรณ์ใหม่สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};

export const useGetEquipments = (
  limit?: number,
  page?: number,
  categoryId?: string,
  subCategoryId?: string,
  status?: ActiveStatus,
  totalStock?: QuerySortType,
  search?: string,
) => {
  return useQuery({
    queryKey: [
      "equipment",
      page,
      status,
      categoryId,
      subCategoryId,
      totalStock,
      search,
    ],
    queryFn: async () => {
      const params = {
        page,
        status,
        search,
        categoryId,
        subCategoryId,
        totalStock,
      };

      const { data } = await api.get<EquipmentResponse>("/equipment", {
        params,
      });
      return data;
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | undefined) => {
      const equipment = await api.delete(`/equipment/${id}`);
      return equipment;
    },
    onSuccess: () => {
      toast.success("ลบอุปกรณ์สำเสร็จ");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};
