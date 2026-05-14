import axios from "axios";
import type { User, BusinessProfile, WizardData, MenuImportResult } from "@/types";

const rawUrl = import.meta.env.VITE_API_URL ?? "";
const base = rawUrl
  ? `${rawUrl.replace(/\/api\/?$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ap_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ap_token");
      localStorage.removeItem("ap_user");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ user: User; token: string }>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>("/auth/login", data),
  me: () => api.get<{ user: User }>("/auth/me"),
};

export const businessApi = {
  create: (data: WizardData) => api.post<{ profile: BusinessProfile }>("/business", data),
  list: () => api.get<{ profiles: BusinessProfile[] }>("/business"),
  get: (id: string) => api.get<{ profile: BusinessProfile }>(`/business/${id}`),
  delete: (id: string) => api.delete(`/business/${id}`),
};

export const analyzeApi = {
  run: (profileId: string) => api.post<{ profile: BusinessProfile }>(`/analyze/${profileId}`),
};

export const menuImportApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    // Drop the JSON default Content-Type so the browser sets the multipart
    // boundary itself. Deleting the header is more reliable than setting it
    // to undefined (which axios can serialize as the literal string).
    return api.post<MenuImportResult>("/menu-import", form, {
      transformRequest: (data, headers) => {
        delete headers["Content-Type"];
        return data;
      },
    });
  },
};

export default api;
