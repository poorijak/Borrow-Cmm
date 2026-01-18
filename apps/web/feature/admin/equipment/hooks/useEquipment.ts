import { EquipmentFormValue } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertEquipment } from "../server/equipment";
import { toast } from "sonner";

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
