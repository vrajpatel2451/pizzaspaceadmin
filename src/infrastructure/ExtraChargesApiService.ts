// services/api/ExtraChargesApi.ts
import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  ExtraChargesCreateData,
  ExtraChargesQueryParams,
  ExtraChargesResponse,
  ExtraChargesUpdateData,
} from "@/types/extraCharges.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class ExtraChargesApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/extra-charges";
  private serviceName: string = "ExtraChargesApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchExtraCharges(
    query: ExtraChargesQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<ExtraChargesResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<ExtraChargesResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<ExtraChargesResponse>>,
        ExtraChargesQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchExtraCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchExtraCharges", url);
    }

    return result;
  }

  async createExtraCharges(
    body: ExtraChargesCreateData,
  ): Promise<BaseApiResponse<ExtraChargesResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<ExtraChargesResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<ExtraChargesResponse>,
        ExtraChargesCreateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createExtraCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createExtraCharges", url);
    }

    return result;
  }

  async updateExtraCharges(
    body: ExtraChargesUpdateData,
    id: string,
  ): Promise<BaseApiResponse<ExtraChargesResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<ExtraChargesResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<ExtraChargesResponse>,
        ExtraChargesUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateExtraCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateExtraCharges", url);
    }

    return result;
  }

  async deleteExtraCharges(id: string): Promise<BaseApiResponse<boolean>> {
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
          `${this.serviceName}: Statuscode is different for deleteExtraCharges`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "deleteExtraCharges", url);
    }

    return result;
  }

  async getExtraChargesDetails(
    id: string,
  ): Promise<BaseApiResponse<ExtraChargesResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<ExtraChargesResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<ExtraChargesResponse>>(
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
          `${this.serviceName}: Statuscode is different for getExtraChargesDetails`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getExtraChargesDetails", url);
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

export const extraChargesApiService = new ExtraChargesApiService(baseApi);
