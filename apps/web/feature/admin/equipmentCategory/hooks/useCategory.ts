import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertCategory } from "../server/category";
import { toast } from "sonner";
import { CategoryFormValue } from "@repo/schemas";
import { ActiveStatus, CategoriesResponse } from "@repo/types";
import api from "@/lib/axios";

interface updateStatusValue {
  id: string;
  newStatus: ActiveStatus;
}

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

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("ลบหมวดหมุ่สำเสร็จ");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });

  return mutate;
};

export const useGetCategories = (
  page?: number,
  limit?: number,
  status?: ActiveStatus
) => {
  const query = useQuery({
    queryKey: ["categories", status, page],
    queryFn: async ({ queryKey }) => {
      const [, status, page] = queryKey as ["categories", ActiveStatus, number];

      const { data } = await api.get<CategoriesResponse>("/categories", {
        params: { status, page, limit },
      });

      return data;
    },
  });
  return query;
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation<
    any,
    Error,
    updateStatusValue,
    {
      prevCategories: [
        queryKey: readonly unknown[],
        data: CategoriesResponse | undefined,
      ][];
    }
  >({
    mutationFn: async ({ id, newStatus }) => {
      const { data } = await api.patch(`/categories/${id}/status`, {
        status: newStatus,
      });
      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const prevCategories = queryClient.getQueriesData<CategoriesResponse>({
        queryKey: ["categories"],
      });

      queryClient.setQueriesData<CategoriesResponse>(
        { queryKey: ["categories"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === variables.id
                ? { ...item, status: variables.newStatus }
                : item
            ),
          };
        }
      );

      return { prevCategories };
    },
    onError: (error, variables, context) => {
      if (context?.prevCategories) {
        context.prevCategories.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
      toast.error(error.message || "เกิดข้อผิดพลาดจาก");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  return mutate;
};
