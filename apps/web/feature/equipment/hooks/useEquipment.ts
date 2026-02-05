"use client"


import api from "@/lib/axios";
import { CategoryDetailResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

export const useGetEquipmentByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: ["equipment", categoryId],
    queryFn: async ({ queryKey }) => {
      const [_, categoryId] = queryKey as ["equipment", string];
      const { data } = await api.get<CategoryDetailResponse>(
        `/equipment/${categoryId}`,
      );

      return data;
    },
  });
};
