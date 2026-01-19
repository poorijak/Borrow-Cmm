import api from "@/lib/axios";
import { subCategoryValue } from "@repo/schemas";
import {
  Categories,
  CategoriesResponse,
  SubCategoriesResponse,
} from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCategoryDetail = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await api.get<Categories>(`/categories/${id}`);
      return data;
    },
    initialData: () => {
      const allCache = queryClient.getQueriesData<CategoriesResponse>({
        queryKey: ["categories", id],
      });

      for (const [key, cacheData] of allCache) {
        const foundItem = cacheData?.data.find((i) => i.id === id);

        if (key.includes(id)) continue;

        if (foundItem) return foundItem;
      }
      return undefined;
    },
  });
};

export const useSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      mainCateId,
      id,
    }: {
      data: subCategoryValue;
      mainCateId: string;
      id?: string;
    }) => {
      const { data: subCate } = id
        ? await api.patch(`/categories/${mainCateId}/subCategory/${id}`, data)
        : await api.post(`/categories/${mainCateId}/subCategory`, data);
      return subCate;
    },
    onSuccess: () => {
      toast.success("สร้างหมวดหมู่ย่อยสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["sub-category"] });
    },
  });
};

export const useGetSubCategories = (
  mainCateId?: string,
  page?: number,
  limit?: number,
) => {
  return useQuery({
    queryKey: ["sub-category", mainCateId, page],
    queryFn: async ({ queryKey }) => {
      const [, mainCateId, page] = queryKey as ["sub-category", string, number];

      const { data } = await api.get<SubCategoriesResponse>(
        `/categories/${mainCateId}/subCategories`,
        { params: { page, limit } },
      );

      return data;
    },
    enabled: !!mainCateId,
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/categories/subCategory/${id}`);
    },
    onSuccess: () => {
      toast.success("ลบหมวดหมู่ย่อยสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["sub-category"] });
    },
  });
};
