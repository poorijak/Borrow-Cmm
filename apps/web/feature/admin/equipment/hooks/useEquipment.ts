import { EquipmentFormValue } from "@repo/schemas";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { upsertEquipment } from "../server/equipment";
import { toast } from "sonner";
import { ActiveStatus, EquipmentResponse } from "@repo/types";
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
  status?: ActiveStatus,
) => {
  return useQuery({
    queryKey: ["equipment", page, status, categoryId],
    queryFn: async ({ queryKey }) => {
      const [_, page, status, categoryId] = queryKey as [
        "equipment",
        number,
        ActiveStatus,
        string,
      ];
      const { data } = await api.get<EquipmentResponse>("/equipment", {
        params: { status, page, limit, categoryId },
      });
      return data;
    },
  });
};
