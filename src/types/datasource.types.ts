import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export type UrlParams = Record<string, number | string>;

export interface InterceptorRequestConfig<T>
  extends InternalAxiosRequestConfig<T> {
  camelizeResponse?: boolean;
  requestId?: string | number;
  retryCount?: number;
}

export interface InterceptorResponse<T, D> extends AxiosResponse<T, D> {
  config: InterceptorRequestConfig<D>;
}

export interface BaseApi {
  get?<T, B = UrlParams, R = InterceptorResponse<T, B>>(
    url: string,
    payload?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R>;
  delete?<T, R = InterceptorResponse<T, null>>(
    url: string,
    config?: InterceptorRequestConfig<null>,
  ): Promise<R>;
  post?<T, B, R = InterceptorResponse<T, B>>(
    url: string,
    data?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R>;
  put?<T, B, R = InterceptorResponse<T, B>>(
    url: string,
    data?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R>;
  patch?<T, B, R = InterceptorResponse<T, B>>(
    url: string,
    data?: B,
    config?: InterceptorRequestConfig<B>,
  ): Promise<R>;
}
