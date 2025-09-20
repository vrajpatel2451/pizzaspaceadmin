import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from "axios";
import { cloneDeep, isEmpty } from "lodash";
import qs from "query-string";
import type {
  InterceptorRequestConfig,
  BaseApi,
  InterceptorResponse,
  UrlParams,
} from "@/types/datasource.types";
import { setupApiLogging } from "@/logger/interceptor";
import { LocalStorageUtil } from "@/utils/localStorageUtil";

export const defHeaders = new AxiosHeaders();

export const apiConfig: InterceptorRequestConfig<null> = {
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 2 * 60 * 1000,
  headers: {
    ...defHeaders,
    Accept: "application/json",
  } as AxiosRequestHeaders,
};

class BaseApiService implements BaseApi {
  protected api: AxiosInstance;
  constructor(config?: InterceptorRequestConfig<null>) {
    this.api = axios.create(config);
    this.api.interceptors.request.use(this.requestInterceptors.bind(this));
    setupApiLogging(this.api);
  }

  private async requestInterceptors<T>(
    config: InterceptorRequestConfig<T>,
  ): Promise<InterceptorRequestConfig<T>> {
    config.headers = config.headers || defHeaders;
    // token
    const token = LocalStorageUtil.getItem("staff_access_token");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return Promise.resolve(config);
  }

  get<T, B = UrlParams, R = InterceptorResponse<T, B>>(
    url: string,
    payload?: B,
    config?: InterceptorRequestConfig<B>,
    encode = false,
  ): Promise<R> {
    url += !isEmpty(payload)
      ? `?${qs.stringify(payload as any, { encode: encode })}`
      : "";
    return this.api.get(url, config);
  }

  delete<T, R = InterceptorResponse<T, null>>(
    url: string,
    config?: InterceptorRequestConfig<null>,
  ): Promise<R> {
    return this.api.delete(url, config);
  }

  post<T, B, R = InterceptorResponse<T, B>>(
    url: string,
    data?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R> {
    return this.api.post(url, data, config);
  }

  put<T, B, R = InterceptorResponse<T, B>>(
    url: string,
    data?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R> {
    return this.api.put(url, data, config);
  }

  patch<T, B, R = InterceptorResponse<T, B>>(
    url: string,
    data?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R> {
    return this.api.patch(url, data, config);
  }
}

const baseApi = new BaseApiService(cloneDeep(apiConfig));
export { baseApi };
