import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  DashboardRequestBody,
  DashboardResponse,
  ReportsRequest,
  ReportsResponse,
} from "@/types/analytics.types";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class AnalyticsApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/analytics";
  private serviceName: string = "AnalyticsApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async getDashboardData(
    body: DashboardRequestBody,
  ): Promise<BaseApiResponse<DashboardResponse>> {
    const url = `${this.baseUrl}/dashboard`;
    const result: BaseApiResponse<DashboardResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<DashboardResponse>,
        DashboardRequestBody
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
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

  async getReports(
    body: ReportsRequest,
  ): Promise<BaseApiResponse<ReportsResponse>> {
    const url = `${this.baseUrl}/reports`;
    const result: BaseApiResponse<ReportsResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<ReportsResponse>,
        ReportsRequest
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Error fetching reports`, {
          data,
          status: data.statusCode,
        });
      }
    } catch (error) {
      this.handleError(error, result, "getReports", url);
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

export const analyticsApiService = new AnalyticsApiService(baseApi);
