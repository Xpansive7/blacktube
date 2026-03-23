import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
