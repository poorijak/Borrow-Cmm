import api from "@/lib/axios";
import { BorrowFormValues, BorrowValues } from "@repo/schemas";
import {
  borrowRequest,
  Course,
  CourseList,
  uploadImageResponse,
  User,
} from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useGetInstrutor = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get<User[]>("user/instrutor");
      return data;
    },
  });
};

export const useGetCourse = () => {
  return useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const { data } = await api.get<CourseList[]>("course/list");
      return data;
    },
  });
};

export const useMutateCheckout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: BorrowFormValues) => {
      let imageKey: string | undefined;
      const imageFile = data.step1.idCardImageFile;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const { data: uploadRes } = await api.post<uploadImageResponse>(
          "/upload/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        imageKey = uploadRes.key;
      }

      if (!imageKey) {
        throw new Error("Image key is require");
      }

      const { ...step1Rest } = data.step1;

      const payload: BorrowValues = {
        step1: {
          ...step1Rest,
          idCardImageKey: imageKey,
        },
        ...(data.equipment?.subjectId && { equipment: data.equipment }),
        ...(data.lab?.subjectId && { lab: data.lab }),
      };

      const { data: response } = await api.post("/checkout", payload);
      return response;
    },
    onSuccess: () => {
      toast.success("ส่งคำขอสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["request"] });
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    },
  });
};
