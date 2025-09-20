import type {
  StoreCreateData,
  StoreQueryParams,
  StoreResponse,
  StoreUpdateData,
} from "@/features/company-management/types/StoreTypes";
import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class StoreApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/store";
  private serviceName: string = "StoreApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchStores(
    query: StoreQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<StoreResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<StoreResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<StoreResponse>>,
        StoreQueryParams
      >(url, query);
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
  async createStores(
    body: StoreCreateData,
  ): Promise<BaseApiResponse<StoreResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<StoreResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<StoreResponse>,
        StoreCreateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
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
  async deleteStore(id: string): Promise<BaseApiResponse<boolean>> {
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
  async updateStores(
    body: StoreUpdateData,
    id: string,
  ): Promise<BaseApiResponse<StoreResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<StoreResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<StoreResponse>,
        StoreUpdateData
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
  async getStoresDetails(id: string): Promise<BaseApiResponse<StoreResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<StoreResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<StoreResponse>>(url);
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

export const storeApiService = new StoreApiService(baseApi);
