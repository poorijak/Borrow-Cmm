import api from "@/lib/axios";
import { QuerySortType, Role, StaffResponse, User, UserResponse } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface udpateRoleValue {
  id: string;
  newRole: Role;
}

export const useGetStaff = (
  limit?: number,
  page?: number,
  search?: string,
  createdAt?: QuerySortType,
  updatedAt?: QuerySortType,
  role?: string,
) => {
  return useQuery<StaffResponse>({
    queryKey: ["user", limit, page, search, createdAt, updatedAt, role],
    queryFn: async () => {
      const params = { limit, page, search, createdAt, updatedAt, role };

      const { data } = await api.get<StaffResponse>("/user/staff", {
        params,
      });

      return data;
    },
  });
};

export const useGetStudent = (
  limit?: number,
  page?: number,
  search?: string,
  createdAt?: QuerySortType,
  overDue?: QuerySortType,
  borrowed?: QuerySortType,
) => {
  const query = useQuery({
    queryKey: ["user", limit, page, search],
    queryFn: async () => {
      const params = {
        limit,
        page,
        search,
        createdAt,
        overDue,
        borrowed,
      };

      const { data } = await api.get<UserResponse>("/user/student", {
        params,
      });

      return data;
    },
  });
  return query;
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    udpateRoleValue,
    {
      prevUser: [
        queryKey: readonly unknown[],
        data: StaffResponse | undefined,
      ][];
    }
  >({
    mutationFn: async ({ id, newRole }) => {
      const { data } = await api.patch(`/user/${id}`, { role: newRole });
      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const prevUser = queryClient.getQueriesData<StaffResponse>({
        queryKey: ["user"],
      });

      queryClient.setQueriesData<StaffResponse>(
        { queryKey: ["user"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === variables.id
                ? { ...item, status: variables.newRole }
                : item,
            ),
          };
        },
      );

      return { prevUser };
    },
    onError: (error, variables, context) => {
      if (context?.prevUser) {
        context.prevUser.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
      toast.error(error.message || "เกิดข้อผิดพลาดจาก");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
