import api from "@/lib/axios";
import { CourseFormValue } from "@repo/schemas";
import { ActiveStatus, CourseResponse } from "@repo/types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface updateStatusValue {
  id: string;
  newStatus: ActiveStatus;
}

export const useMutateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CourseFormValue) => {
      const { data: course } = data.courseId
        ? await api.patch(`/course/${data.courseId}`, data)
        : await api.post("/course", data);
      return course;
    },
    onSuccess: (data, variables) => {
      toast.success(data ? "แก้ไขรายวิชาสำเร็จ" : "เพิ่มวิชาใหม่สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};

export const useCourse = (
  stauts?: string,
  search?: string,
  coruseId?: string,
  page?: number,
  limit?: number,
) => {
  return useQuery({
    queryKey: ["course", stauts, page, limit, search, coruseId],
    queryFn: async ({ queryKey }) => {
      const [_, status, page, limit, search, courseId] = queryKey as [
        "course",
        ActiveStatus,
        number,
        number,
        string,
        string,
      ];

      const { data } = await api.get<CourseResponse>("/course", {
        params: { status, page, limit, search, courseId },
      });
      return data;
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation<
    any,
    Error,
    updateStatusValue,
    {
      prev: [
        queryKey: readonly unknown[],
        data: CourseResponse | undefined,
      ][];
    }
  >({
    mutationFn: async ({ id, newStatus }) => {
      const { data } = await api.patch(`/course/${id}/status`, {
        status: newStatus,
      });
      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["course"] });

      const prev = queryClient.getQueriesData<CourseResponse>({
        queryKey: ["course"],
      });

      queryClient.setQueriesData<CourseResponse>(
        { queryKey: ["course"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === variables.id
                ? { ...item, status: variables.newStatus }
                : item,
            ),
          };
        },
      );

      return { prev };
    },
    onError: (error, variables, context) => {
      if (context?.prev) {
        context.prev.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
      toast.error(error.message || "เกิดข้อผิดพลาดจาก");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
  return mutate;
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | undefined) => {
      return await api.delete(`/course/${id}`);
    },
    onSuccess: () => {
      toast.success("ลบวิชาสำเสร็จ");
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};
