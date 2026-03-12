import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { getFromLocalStorage, STORAGE_KEY } from "../local-storage-service";

const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "https://nominatim.openstreetmap.org",
});

instance.interceptors.request.use(
  async (reqConfig: InternalAxiosRequestConfig) => {
    let { headers } = reqConfig;

    const token = getFromLocalStorage(STORAGE_KEY.SEARCH);
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

instance.interceptors.response.use(
  (response) => response,

  (error) => {
    const requestUrl = error.config?.url;
    if (error.response?.status === 401 && requestUrl !== "/api/token/") {
      localStorage.removeItem(STORAGE_KEY.SEARCH);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default instance;
