// services/api/DeliveryChargesApi.ts
import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  DeliveryChargesCreateData,
  DeliveryChargesQueryParams,
  DeliveryChargesResponse,
  DeliveryChargesUpdateData,
} from "@/types/deliveryCharges.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class DeliveryChargesApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/delivery-charges";
  private serviceName: string = "DeliveryChargesApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchDeliveryCharges(
    query: DeliveryChargesQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<DeliveryChargesResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<DeliveryChargesResponse>> =
      {
        data: null,
        success: false,
        errorMessage: null,
      };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<DeliveryChargesResponse>>,
        DeliveryChargesQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchDeliveryCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchDeliveryCharges", url);
    }

    return result;
  }

  async createDeliveryCharges(
    body: DeliveryChargesCreateData,
  ): Promise<BaseApiResponse<DeliveryChargesResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<DeliveryChargesResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<DeliveryChargesResponse>,
        DeliveryChargesCreateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createDeliveryCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createDeliveryCharges", url);
    }

    return result;
  }

  async updateDeliveryCharges(
    body: DeliveryChargesUpdateData,
    id: string,
  ): Promise<BaseApiResponse<DeliveryChargesResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<DeliveryChargesResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<DeliveryChargesResponse>,
        DeliveryChargesUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateDeliveryCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateDeliveryCharges", url);
    }

    return result;
  }

  async deleteDeliveryCharges(id: string): Promise<BaseApiResponse<boolean>> {
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
          `${this.serviceName}: Statuscode is different for deleteDeliveryCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "deleteDeliveryCharges", url);
    }

    return result;
  }

  async getDeliveryChargesDetails(
    id: string,
  ): Promise<BaseApiResponse<DeliveryChargesResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<DeliveryChargesResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<DeliveryChargesResponse>>(
          url,
        );
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getDeliveryChargesDetails`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getDeliveryChargesDetails", url);
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

export const deliveryChargesApiService = new DeliveryChargesApiService(baseApi);
