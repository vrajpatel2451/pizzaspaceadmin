import axios, { AxiosError } from "axios";
import { logger } from "./core";
import type { BaseApiResponse } from "@/types/baseApi.types";

export class ServiceErrorHandler {
  static handleError<T>(
    error: Error,
    result: BaseApiResponse<T>,
    context: {
      service: string;
      method: string;
      url?: string;
    },
  ): void {
    const axiosError = error as AxiosError;

    if (axiosError?.isAxiosError) {
      const message =
        (axiosError?.response?.data as any as BaseApiResponse<null>)
          ?.errorMessage || "Something went wrong";
      const cancelled = axios.isCancel(error);
      result.success = false;
      result.errorMessage = cancelled
        ? "Server call has been cancelled"
        : message;
    } else {
      result.errorMessage = "Something went wrong";
      result.success = false;
      logger.error(
        `${context.service}: Error occurred in ${context.method}`,
        error,
        {
          service: context.service,
          method: context.method,
          url: context.url,
        },
        {
          method: context.method,
          component: context.service,
        },
      );
    }
  }
}
