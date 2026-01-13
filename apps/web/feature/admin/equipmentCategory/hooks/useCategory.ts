import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getCategories } from "../server/category";
import { toast } from "sonner";
import { CategoryFormValue } from "@repo/schemas";
import { ActiveStatus } from "@repo/types";

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

export const useGetCategories = (status: ActiveStatus, page: number) => {
  const query = useQuery({
    queryKey: ["categories", status , page],
    queryFn: () => getCategories(status, page),
  });

  return query;
};
