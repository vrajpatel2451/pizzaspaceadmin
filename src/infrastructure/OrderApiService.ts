import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  AdminTransformedOrder,
  CheckoutRequest,
  CheckoutResponse,
  OrderQueryParams,
} from "@/types/order.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class OrderApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/orders";
  private serviceName: string = "OrderApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchOrders(
    query: OrderQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<AdminTransformedOrder>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<AdminTransformedOrder>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<AdminTransformedOrder>>,
        OrderQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchOrders`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchOrders", url);
    }

    return result;
  }

  async checkout(
    body: CheckoutRequest,
  ): Promise<BaseApiResponse<CheckoutResponse>> {
    const url = this.baseUrl + "/checkout";
    const result: BaseApiResponse<CheckoutResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    // Clean up optional fields
    const nBody = { ...body };
    if (!nBody.addressId) {
      delete nBody.addressId;
    }
    if (!nBody.customerMessage) {
      delete nBody.customerMessage;
    }
    if (!nBody.discountIds?.length) {
      delete nBody.discountIds;
    }

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<CheckoutResponse>,
        CheckoutRequest
      >(url, nBody);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for checkout`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "checkout", url);
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

export const orderApiService = new OrderApiService(baseApi);
