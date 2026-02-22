// feature/users/server/user.ts
import api from "@/lib/axios";
import { User } from "@repo/types";
import { cookies } from "next/headers";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const allCookie = cookieStore.toString();

    if (!allCookie) return null;

    const { data } = await api.get<User>("/auth/me", {
      headers: {
        Cookie: allCookie,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error("Unauthorized: Access token might be expired.");
      return null; // คืนค่า null เพื่อให้ Layout ตัดสินใจทำ redirect
    }
    throw error;
  }
}
