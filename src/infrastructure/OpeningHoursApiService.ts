import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type {
  OpeningHoursCreateData,
  OpeningHoursResponse,
  OpeningHoursUpdateData,
} from "@/types/openingHours.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class OpeningHoursApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/openinghours";
  private serviceName: string = "OpeningHoursApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchOpeningHoursList(): Promise<
    BaseApiResponse<OpeningHoursResponse[]>
  > {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<OpeningHoursResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<OpeningHoursResponse[]>
      >(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Statuscode mismatch`, {
          data,
          status: data.statusCode,
        });
      }
    } catch (error) {
      this.handleError(error, result, "fetchOpeningHoursList", url);
    }

    return result;
  }

  async createOpeningHours(
    body: OpeningHoursCreateData
  ): Promise<BaseApiResponse<OpeningHoursResponse>> {
    const url = `${this.baseUrl}/create`;
    const result: BaseApiResponse<OpeningHoursResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<OpeningHoursResponse>,
        OpeningHoursCreateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Statuscode mismatch`, {
          data,
          status: data.statusCode,
        });
      }
    } catch (error) {
      this.handleError(error, result, "createOpeningHours", url);
    }

    return result;
  }

  async updateOpeningHours(
    id: string,
    body: OpeningHoursUpdateData
  ): Promise<BaseApiResponse<OpeningHoursResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<OpeningHoursResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<OpeningHoursResponse>,
        OpeningHoursUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Statuscode mismatch`, {
          data,
          status: data.statusCode,
        });
      }
    } catch (error) {
      this.handleError(error, result, "updateOpeningHours", url);
    }

    return result;
  }

  async deleteOpeningHours(id: string): Promise<BaseApiResponse<boolean>> {
    const url = `${this.baseUrl}/delete/${id}`;
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
        logger.warn(`${this.serviceName}: Statuscode mismatch`, {
          data,
          status: data.statusCode,
        });
      }
    } catch (error) {
      this.handleError(error, result, "deleteOpeningHours", url);
    }

    return result;
  }

  protected handleError<T>(
    error: any,
    result: BaseApiResponse<T>,
    methodName: string,
    url: string
  ) {
    ServiceErrorHandler.handleError(error, result, {
      service: this.serviceName,
      method: methodName,
      url,
    });
  }
}

export const openingHoursApiService = new OpeningHoursApiService(baseApi);
