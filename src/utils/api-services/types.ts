import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface IRequestParamsOptions<D = any> {
  api: AxiosInstance;
  url?: string;
  config?: AxiosRequestConfig;
  data?: D;
}
