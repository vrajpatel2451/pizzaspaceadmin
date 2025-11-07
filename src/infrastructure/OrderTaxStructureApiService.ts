// services/api/OrderTaxStructureApi.ts
import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  OrderTaxStructureCreateData,
  OrderTaxStructureQueryParams,
  OrderTaxStructureResponse,
  OrderTaxStructureUpdateData,
} from "@/types/orderTaxStructure.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class OrderTaxStructureApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/order-tax-structure";
  private serviceName: string = "OrderTaxStructureApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchOrderTaxStructures(
    query: OrderTaxStructureQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<OrderTaxStructureResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<
      PaginatedResponse<OrderTaxStructureResponse>
    > = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<OrderTaxStructureResponse>>,
        OrderTaxStructureQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchOrderTaxStructures`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchOrderTaxStructures", url);
    }

    return result;
  }

  async createOrderTaxStructure(
    body: OrderTaxStructureCreateData,
  ): Promise<BaseApiResponse<OrderTaxStructureResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<OrderTaxStructureResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<OrderTaxStructureResponse>,
        OrderTaxStructureCreateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createOrderTaxStructure`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createOrderTaxStructure", url);
    }

    return result;
  }

  async updateOrderTaxStructure(
    body: OrderTaxStructureUpdateData,
    id: string,
  ): Promise<BaseApiResponse<OrderTaxStructureResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<OrderTaxStructureResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<OrderTaxStructureResponse>,
        OrderTaxStructureUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateOrderTaxStructure`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateOrderTaxStructure", url);
    }

    return result;
  }

  async deleteOrderTaxStructure(id: string): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + `/${id}`;
    const result: BaseApiResponse<boolean> = {
      data: false,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.delete<ServerApiResponse<boolean>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for deleteOrderTaxStructure`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "deleteOrderTaxStructure", url);
    }

    return result;
  }

  async getOrderTaxStructureDetails(
    id: string,
  ): Promise<BaseApiResponse<OrderTaxStructureResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<OrderTaxStructureResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<
          ServerApiResponse<OrderTaxStructureResponse>
        >(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getOrderTaxStructureDetails`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getOrderTaxStructureDetails", url);
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

export const orderTaxStructureApiService = new OrderTaxStructureApiService(
  baseApi,
);
