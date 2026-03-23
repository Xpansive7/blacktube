import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("auth_token");
        window.localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function assertApiConfigured() {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL nao configurada. Defina a URL publica do backend."
    );
  }
}

export default api;
