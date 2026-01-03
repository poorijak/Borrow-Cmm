import axios from "axios";

const isServer = typeof window === "undefined";
console.log("Running Axios on:", isServer ? "SERVER" : "CLIENT");
console.log(
  "Base URL is:",
  isServer ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL
);

const api = axios.create({
  baseURL: isServer
    ? process.env.API_URL_INTERNAL 
    : process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isServer = typeof window === "undefined";
    if (
      error.response?.status !== 401 ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (isServer) {
      return Promise.reject(error);
    }

    if (!originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Client-side: Token expired, refreshing...");
        await api.get("/auth/refresh");

        console.log("Client-side: Refresh success, retrying...");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
