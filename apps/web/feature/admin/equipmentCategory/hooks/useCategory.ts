import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../server/category";
import { toast } from "sonner";
import { CategoryFormValue } from "@repo/schemas";

export const useMutationCategory = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (data: CategoryFormValue) => createCategory(data),
    onSuccess: () => {
      toast.success("สร้างหมวดหมู่สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });

  return mutate;
};
