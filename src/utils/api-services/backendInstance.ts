import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { STORAGE_KEY } from "../local-storage-service";

const backendInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
});

backendInstance.interceptors.request.use(
  async (reqConfig: InternalAxiosRequestConfig) => {
    let { headers } = reqConfig;

    const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    if (token) {
      headers = new AxiosHeaders({
        ...headers,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      });
    }

    return { ...reqConfig, headers };
  },
);

backendInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const requestUrl = error.config?.url;
    if (error.response?.status === 401 && requestUrl !== "/login") {
      localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default backendInstance;
