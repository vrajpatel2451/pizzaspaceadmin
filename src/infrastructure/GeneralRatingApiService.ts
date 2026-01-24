import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  GeneralRatingCreateData,
  GeneralRatingQueryParams,
  GeneralRatingResponse,
  GeneralRatingUpdateData,
} from "@/types/generalRating.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class GeneralRatingApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/general-ratings";
  private serviceName: string = "GeneralRatingApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchGeneralRatingsList(
    query: GeneralRatingQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<GeneralRatingResponse>>> {
    const url = `${this.baseUrl}/admin/list`;
    const result: BaseApiResponse<PaginatedResponse<GeneralRatingResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<GeneralRatingResponse>>,
        GeneralRatingQueryParams
      >(url, query);
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
      this.handleError(error, result, "fetchGeneralRatingsList", url);
    }

    return result;
  }

  async updateGeneralRating(
    id: string,
    body: GeneralRatingUpdateData,
  ): Promise<BaseApiResponse<GeneralRatingResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<GeneralRatingResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<GeneralRatingResponse>,
        GeneralRatingUpdateData
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
      this.handleError(error, result, "updateGeneralRating", url);
    }

    return result;
  }
  async createGeneralRating(
    body: GeneralRatingCreateData,
  ): Promise<BaseApiResponse<GeneralRatingResponse>> {
    const url = `${this.baseUrl}/create`;
    const result: BaseApiResponse<GeneralRatingResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<GeneralRatingResponse>,
        GeneralRatingUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Statuscode mismatched`, {
          data,
          status: data.statusCode,
        });
      }
    } catch (error) {
      this.handleError(error, result, "updateGeneralRating", url);
    }

    return result;
  }

  async deleteGeneralRating(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deleteGeneralRating", url);
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

export const generalRatingApiService = new GeneralRatingApiService(baseApi);
