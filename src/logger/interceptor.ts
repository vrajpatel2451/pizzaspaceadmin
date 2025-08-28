import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { logger } from "./core";
import { generateRequestId } from "./utils";
import type { ApiLogData } from "./types";
import type { InterceptorRequestConfig } from "@/types/datasource.types";

interface RequestMetadata {
  requestId: string;
  startTime: number;
  method: string;
  url: string;
}

declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: RequestMetadata;
  }
}

export const setupApiLogging = (
  axiosInstance: AxiosInstance,
): AxiosInstance => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InterceptorRequestConfig<null>) => {
      const requestId = generateRequestId();
      const startTime = Date.now();

      config.metadata = {
        requestId,
        startTime,
        method: config.method?.toUpperCase() || "UNKNOWN",
        url: config.url || "",
      };

      // Add request ID to headers (like your existing code)
      //   if (!config.headers) config.headers = {};
      config.headers["requestId"] = requestId;

      logger.addBreadcrumb(
        `API Request: ${config.metadata.method} ${config.metadata.url}`,
        "http",
        {
          method: config.metadata.method,
          url: config.metadata.url,
          requestId,
        },
      );

      logger.debug(
        `API Request: ${config.metadata.method} ${config.metadata.url}`,
        {
          request: {
            url: config.metadata.url,
            method: config.metadata.method,
            headers: config.headers,
            data: config.data,
            params: config.params,
          },
        },
        {
          component: "api_client",
          method: config.metadata.method,
          request_id: requestId,
        },
      );

      return config;
    },
    (error: AxiosError) => {
      logger.error("Request setup error", error, {
        component: "api_interceptor",
        type: "request_error",
      });
      return Promise.reject(error);
    },
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const { config } = response;
      const duration = Date.now() - (config.metadata?.startTime || 0);

      const apiLogData: ApiLogData = {
        requestId: config.metadata?.requestId || "unknown",
        method: config.metadata?.method || "UNKNOWN",
        url: config.metadata?.url || config.url || "",
        status: response.status,
        statusText: response.statusText,
        duration,
        request: {
          headers: config.headers,
          data: config.data,
          params: config.params,
        },
        response: {
          headers: response.headers,
          data: response.data,
        },
        timestamp: new Date().toISOString(),
      };

      // Only log success in development or for errors
      if (process.env.NODE_ENV === "development" || response.status >= 400) {
        logger.apiLog(apiLogData, response.status >= 400);
      }

      return response;
    },
    (error: AxiosError) => {
      const { config, response } = error;
      const duration = Date.now() - (config?.metadata?.startTime || 0);

      const apiLogData: ApiLogData = {
        requestId: config?.metadata?.requestId || "unknown",
        method: config?.metadata?.method || "UNKNOWN",
        url: config?.metadata?.url || config?.url || "",
        status: response?.status,
        statusText: response?.statusText || "Network Error",
        duration,
        request: {
          headers: config?.headers,
          data: config?.data,
          params: config?.params,
        },
        response: response
          ? {
              headers: response.headers,
              data: response.data,
            }
          : undefined,
        error,
        timestamp: new Date().toISOString(),
      };

      logger.apiLog(apiLogData, true);

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
