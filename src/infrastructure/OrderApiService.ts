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
  OrderStatus,
  RefundItemData,
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

  async fetchOrderById(
    orderId: string,
  ): Promise<BaseApiResponse<AdminTransformedOrder>> {
    const url = `${this.baseUrl}/details/${orderId}`;
    const result: BaseApiResponse<AdminTransformedOrder> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<AdminTransformedOrder>
      >(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchOrderById`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchOrderById", url);
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

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<BaseApiResponse<AdminTransformedOrder>> {
    const url = `${this.baseUrl}/${orderId}/status`;
    const result: BaseApiResponse<AdminTransformedOrder> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<AdminTransformedOrder>,
        { status: OrderStatus }
      >(url, { status });
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateOrderStatus`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateOrderStatus", url);
    }

    return result;
  }

  async assignStaff(
    orderId: string,
    staffId: string,
  ): Promise<BaseApiResponse<AdminTransformedOrder>> {
    const url = `${this.baseUrl}/${orderId}/assign-staff`;
    const result: BaseApiResponse<AdminTransformedOrder> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<AdminTransformedOrder>,
        { staffId: string }
      >(url, { staffId });
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for assignStaff`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "assignStaff", url);
    }

    return result;
  }

  async refundItems(
    orderId: string,
    items: RefundItemData[],
  ): Promise<BaseApiResponse<AdminTransformedOrder>> {
    const url = `${this.baseUrl}/${orderId}/refund-items`;
    const result: BaseApiResponse<AdminTransformedOrder> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<AdminTransformedOrder>,
        { items: RefundItemData[] }
      >(url, { items });
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for refundItems`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "refundItems", url);
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
