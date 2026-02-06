import api from "@/lib/axios";
import { BorrowBag, LaboratorySortType } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMyBag = (userId?: string) => {
  return useQuery({
    queryKey: ["bag", userId],
    queryFn: async () => {
      const { data } = await api.get<BorrowBag>(`/bag/${userId}`);
      return data;
    },
  });
};

export const useAddToBag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      equipmentId?: string;
      labId?: string;
      date?: string;
      slot?: LaboratorySortType;
    }) => {
      const { data } = await api.post<BorrowBag>("/bag/addToBag", payload);
      return data;
    },
    onSuccess: (_, v) => {
      toast.success(
        v.equipmentId
          ? "เพิ่มอุปกรณ์ลงในกระเป๋า!"
          : "เพิ่มห้องปฏิบัติการใหม่ลงในกระเป๋า!",
      );
      queryClient.invalidateQueries({ queryKey: ["bag", v.userId] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};
