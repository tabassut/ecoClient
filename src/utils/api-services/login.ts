import { AxiosError, type AxiosResponse } from "axios";
import type { IRequestParamsOptions } from "./types";

const LOGIN_URL = {
  LOGIN: `/api/login`,
};

export async function getLoginService<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  try {
    const requestUrl = LOGIN_URL.LOGIN;
    const response = await api.post(requestUrl, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}
