import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { BorrowRequestResponse, EquipmentStatus, LabStatus, RequestQueryType } from "@repo/types";

export const useGetMyRequests = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: RequestQueryType;
}) => {
  return useQuery({
    queryKey: ["my-requests", params],
    queryFn: async () => {
      const { data } = await api.get<BorrowRequestResponse>("/request/me", {
        params,
      });
      return data;
    },
  });
};
