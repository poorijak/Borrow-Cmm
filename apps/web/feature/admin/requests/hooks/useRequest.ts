"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  BorrowRequestDetail,
  BorrowRequestResponse,
  Course,
  EquipmentStatus,
  LabStatus,
  RequestQueryType,
  User,
} from "@repo/types";

export const useGetRequests = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: EquipmentStatus | LabStatus;
  type?: RequestQueryType;
  subjectId?: string[];
  teacherId?: string[];
  orderByDate?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: async () => {
      const { data } = await api.get<BorrowRequestResponse>("/request/admin", {
        params: {
          ...params,
          subjectId: params.subjectId?.join(","),
          teacherId: params.teacherId?.join(","),
        },
      });
      return data;
    },
  });
};

export const useGetRequestById = (id: string) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const { data } = await api.get<BorrowRequestDetail>(`/request/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useGetAllCourse = () => {
  return useQuery({
    queryKey: ["course-all"],
    queryFn: async () => {
      const { data } = await api.get<Course[]>("/course/list");
      return data;
    },
  });
};

export const useGetInstructors = () => {
  return useQuery({
    queryKey: ["instructors-all"],
    queryFn: async () => {
      const { data } = await api.get<User[]>("/user/instrutor"); // Match the 'instrutor' typo in the controller
      return data;
    },
  });
};
