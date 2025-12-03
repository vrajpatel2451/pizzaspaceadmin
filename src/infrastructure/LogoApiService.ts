import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type {
  LogoCreateData,
  LogoDetailsQuery,
  LogoResponse,
  LogoUpdateData,
} from "@/types/logo.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class LogoApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/logos";
  private serviceName: string = "LogoApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchLogosList(): Promise<BaseApiResponse<LogoResponse[]>> {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<LogoResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<LogoResponse[]>
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
      this.handleError(error, result, "fetchLogosList", url);
    }

    return result;
  }

  async fetchLogoDetails(
    query: LogoDetailsQuery
  ): Promise<BaseApiResponse<LogoResponse | null>> {
    const url = `${this.baseUrl}/details`;
    const result: BaseApiResponse<LogoResponse | null> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<LogoResponse | null>,
        LogoDetailsQuery
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
      this.handleError(error, result, "fetchLogoDetails", url);
    }

    return result;
  }

  async createLogo(body: LogoCreateData): Promise<BaseApiResponse<LogoResponse>> {
    const url = `${this.baseUrl}/create`;
    const result: BaseApiResponse<LogoResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<LogoResponse>,
        LogoCreateData
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
      this.handleError(error, result, "createLogo", url);
    }

    return result;
  }

  async updateLogo(
    id: string,
    body: LogoUpdateData
  ): Promise<BaseApiResponse<LogoResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<LogoResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<LogoResponse>,
        LogoUpdateData
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
      this.handleError(error, result, "updateLogo", url);
    }

    return result;
  }

  async deleteLogo(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deleteLogo", url);
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

export const logoApiService = new LogoApiService(baseApi);
