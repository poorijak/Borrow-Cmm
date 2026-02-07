import api from "@/lib/axios";
import { BorrowBag, LaboratorySortType } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateBagValue = {
  itemId?: string;
  action?: "inc" | "dec";
  userId?: string;
  type?: "lab" | "equipment";
};

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

export const useUpdateItemCount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    UpdateBagValue,
    {
      prevBagItem: [
        queryKey: readonly unknown[],
        data: BorrowBag | undefined,
      ][];
    }
  >({
    mutationFn: async (params) => {
      const { itemId, action } = params;
      const { data } =
        action === "inc"
          ? await api.patch(`/bag/${itemId}/increment`)
          : await api.patch(`/bag/${itemId}/decrement`);

      return data;
    },
    onMutate: async (variable, context) => {
      await queryClient.cancelQueries({ queryKey: ["bag", variable.userId] });

      const prevBagItem = queryClient.getQueriesData<BorrowBag>({
        queryKey: ["bag", variable.userId],
      });

      queryClient.setQueryData<BorrowBag>(
        ["bag"],
        (oldData: BorrowBag | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            equipmentItems: oldData.equipmentItems
              .map((item) => {
                if (item.id !== variable.itemId) return item;

                const newCount =
                  variable.action === "inc"
                    ? item.itemCount + 1
                    : item.itemCount - 1;

                return { ...item, itemCount: newCount };
              })
              .filter((Item) => Item.itemCount > 0),
          };
        },
      );
      return { prevBagItem };
    },
    onError: (err, variables, context) => {
      if (context?.prevBagItem) {
        queryClient.setQueryData(
          ["bag", variables.userId],
          context.prevBagItem,
        );
      }
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
  });
};

export const useDeleteBagItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    UpdateBagValue,
    {
      prevBagItem: [
        queryKey: readonly unknown[],
        data: BorrowBag | undefined,
      ][];
    }
  >({
    mutationFn: async (param) => {
      const { type, itemId } = param;

      const { data } =
        type === "lab"
          ? await api.delete(`/bag/lab/${itemId}`)
          : await api.delete(`/bag/equipment/${itemId}`);

      return data;
    },
    onMutate: async (variables, context) => {
      await queryClient.cancelQueries({ queryKey: ["bag", variables.userId] });

      const prevBagItem = queryClient.getQueriesData<BorrowBag>({
        queryKey: ["bag", variables.userId],
      });

      queryClient.setQueryData<BorrowBag>(
        ["bag", variables.userId],
        (oldData: BorrowBag | undefined) => {
          if (!oldData) return oldData;

          if (variables.type === "equipment") {
            return {
              ...oldData,
              equipmentItems: oldData.equipmentItems.filter((item) => {
                return item.id !== variables.itemId;
              }),
            };
          } else {
            return {
              ...oldData,
              labItems: oldData.labItems.filter((item) => {
                return item.id !== variables.itemId;
              }),
            };
          }
        },
      );

      return { prevBagItem };
    },
    onError: (err, variables, context) => {
      if (context?.prevBagItem) {
        queryClient.setQueryData(
          ["bag", variables.userId],
          context.prevBagItem,
        );
      }
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
  });
};
