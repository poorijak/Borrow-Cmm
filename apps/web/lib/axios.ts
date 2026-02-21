import axios from "axios";

const api = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.API_URL_INTERNAL
      : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

if (typeof window !== "undefined") {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const message = error.response?.data?.message || "เกิดข้อผิดพลาด";
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            withCredentials: true,
          });

          return api(originalRequest);
        } catch (refreshError) {
          window.location.href = "/auth/signin";
          return Promise.reject(refreshError);
        }
      }

      const customMessage = error.response?.data?.message || "เกิดข้อผิดพลาด";
      error.message = customMessage;

      return Promise.reject(error);
    },
  );
}

export default api;
