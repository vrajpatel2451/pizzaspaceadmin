import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import type {
  OrderReviewResponse,
  OrderReviewQueryParams,
  OrderItemReviewResponse,
  OrderItemReviewQueryParams,
} from "@/types/review.types";
import { baseApi } from "./BaseApi";

class ReviewApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/review";
  private serviceName: string = "ReviewApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchOrderReviews(
    query: OrderReviewQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<OrderReviewResponse>>> {
    const url = `${this.baseUrl}/order-reviews`;
    const result: BaseApiResponse<PaginatedResponse<OrderReviewResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<OrderReviewResponse>>,
        OrderReviewQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchOrderReviews`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchOrderReviews", url);
    }

    return result;
  }

  async fetchOrderItemReviews(
    query: OrderItemReviewQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<OrderItemReviewResponse>>> {
    const url = `${this.baseUrl}/order-item-reviews`;
    const result: BaseApiResponse<PaginatedResponse<OrderItemReviewResponse>> =
      {
        data: null,
        success: false,
        errorMessage: null,
      };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<OrderItemReviewResponse>>,
        OrderItemReviewQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchOrderItemReviews`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchOrderItemReviews", url);
    }

    return result;
  }

  protected handleError<T>(
    error: any,
    result: BaseApiResponse<T>,
    methodName: string,
    url: string,
  ) {
    ServiceErrorHandler.handleError(error, result, {
      service: this.serviceName,
      method: methodName,
      url,
    });
  }
}

export const reviewApiService = new ReviewApiService(baseApi);
