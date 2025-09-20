import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import type {
  StaffQueryParams,
  StaffResponse,
  StaffUpdateRequest,
} from "@/types/user.types";
import { baseApi } from "./BaseApi";

class StaffApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/staff";
  private serviceName: string = "StaffApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchAllStaff(
    queryParams: StaffQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<StaffResponse>>> {
    const url = this.baseUrl + "/list";
    const result: BaseApiResponse<PaginatedResponse<StaffResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<StaffResponse>>,
        StaffQueryParams
      >(url, queryParams);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for StaffApiServiceFetch`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "StaffApiServiceFetch", url);
    }

    return result;
  }

  async deleteStaff(id: string): Promise<BaseApiResponse<boolean>> {
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
          `${this.serviceName}: Statuscode is different for StoreApiServiceFetch`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "StoreApiServiceFetch", url);
    }

    return result;
  }

  async getStaffDetails(id: string): Promise<BaseApiResponse<StaffResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<StaffResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<StaffResponse>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for StoreApiServiceFetch`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "StoreApiServiceFetch", url);
    }

    return result;
  }
  async updateStaff(
    id: string,
    body: StaffUpdateRequest,
  ): Promise<BaseApiResponse<StaffResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<StaffResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<StaffResponse>,
        StaffUpdateRequest
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for StoreApiServiceFetch`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "StoreApiServiceFetch", url);
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

export const staffApiService = new StaffApiService(baseApi);
