import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: () => api.post("/auth/signout"),
    onSuccess: () => {
      toast.success("ออกจากระบบสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/auth/signin");
    },
    onError: (err) => {
      toast(`ออกจากระบบไม่สำเร็จ: ${err.message}`);
      console.error("ออกจากระบบไม่สำเร็จ:", err.message);
    },
  });

  return mutate;
};
