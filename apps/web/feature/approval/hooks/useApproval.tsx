import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApproveRequest, FindRequestApprovalResponse } from "@repo/types";

export const useGetRequest = (token: string) => {
  return useQuery({
    queryKey: ["request", token],
    queryFn: async () => {
      const { data } = await api.get<FindRequestApprovalResponse>(
        `approval/${token}`,
      );
      return data;
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      token: string;
      status: ApproveRequest;
      type: "equipment" | "laboratory";
      remark?: string;
    }) => {
      const { token, status, type, remark } = body;
      const { data } = await api.patch(`approval/${token}/status`, {
        status,
        type,
        remark,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.token],
      });
    },
  });
};
