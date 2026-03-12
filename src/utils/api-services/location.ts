import { AxiosError, type AxiosResponse } from "axios";
import type { IRequestParamsOptions } from "./types";

interface IRouteRequestBody {
  start: [number, number];
  end: [number, number];
  greenPreference: number;
}

const LOCATION_URL = {
  SEARCH_LOCATION: `/search`,
  SAVE_TRIP: `api/trip/`,
  SAVED_TRIP: `api/save-route/`,
  HISTORY: `api/trips/id`,
  GET_SAVED_ROUTE: `api/saved-routes/id`
};

export async function searchLocation<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>,
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for createQuickNotes"),
    );
  }

  try {
    const requestUrl = url || LOCATION_URL.SEARCH_LOCATION;
    const response = await api.get(requestUrl, { params: data });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function getRoute<R = any>(
  requestParamsOptions: IRequestParamsOptions<IRouteRequestBody>,
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  if (!data) {
    return Promise.reject(new Error("Missing data parameter for getRoute"));
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const response = await api.post(
      `${baseUrl}/api/routes`,
      {
        start: data.start,
        end: data.end,
        greenPreference: data.greenPreference,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function saveTrip<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for saveTrip"),
    );
  }

  try {
    const requestUrl = LOCATION_URL.SAVE_TRIP.replace("id", url);
    const response = await api.post(requestUrl, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function savedTrip<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for saveTrip"),
    );
  }

  try {
    const requestUrl = LOCATION_URL.SAVED_TRIP.replace("id", url);
    const response = await api.post(requestUrl, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function getHistory<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>,
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for getHistory"),
    );
  }

  try {
    const requestUrl = LOCATION_URL.HISTORY.replace("id", url);
    const response = await api.get(requestUrl, { params: data });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function getSavedRoutes<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>,
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for getHistory"),
    );
  }

  try {
    const requestUrl = LOCATION_URL.GET_SAVED_ROUTE.replace("id", url);
    const response = await api.get(requestUrl, { params: data });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}
