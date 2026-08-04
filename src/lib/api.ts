import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      const onAuthPage = path === "/login" || path.startsWith("/auth");
      // Đang ở trang auth (login/register/otp/...) → để component tự báo lỗi,
      // KHÔNG redirect full-reload (tránh xoá state lỗi, gây nháy UI).
      if (!onAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);