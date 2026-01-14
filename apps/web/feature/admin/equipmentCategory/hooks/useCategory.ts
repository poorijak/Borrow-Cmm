import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertCategory } from "../server/category";
import { toast } from "sonner";
import { CategoryFormValue } from "@repo/schemas";
import { ActiveStatus, CategoriesResponse } from "@repo/types";
import api from "@/lib/axios";

export const useMutationCategory = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (data: CategoryFormValue) => upsertCategory(data),
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
    queryKey: ["categories", status, page],
    queryFn: async ({ queryKey }) => {
      const [, status, page] = queryKey as ["categories", ActiveStatus, number];

      const { data } = await api.get<CategoriesResponse>("/categories", {
        params: { status, page },
      });

      return data;
    },
  });
  return query;
};
