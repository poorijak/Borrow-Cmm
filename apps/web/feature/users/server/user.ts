import api from "@/lib/axios";
import { cookies } from "next/headers";

export const getUser = async () => {
  try {
    const allCookie = (await cookies()).toString();
    const { data } = await api.get("/auth/me", {
      headers: {
        Cookie: allCookie,
      },
    });
    return data;
  } catch (error) {
    console.error("Get user failed :", error);
  }
};
