// services/api/DiscountApi.ts
import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  DiscountCreateData,
  DiscountQueryParams,
  DiscountResponse,
  DiscountUpdateData,
} from "@/types/discount.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class DiscountApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/discount";
  private serviceName: string = "DiscountApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchDiscounts(
    query: DiscountQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<DiscountResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<DiscountResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<DiscountResponse>>,
        DiscountQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchDiscounts`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchDiscounts", url);
    }

    return result;
  }

  async getApplicableDiscounts(
    storeId: string,
  ): Promise<BaseApiResponse<DiscountResponse[]>> {
    const url = this.baseUrl + `/applicable/${storeId}`;
    const result: BaseApiResponse<DiscountResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<DiscountResponse[]>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getApplicableDiscounts`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getApplicableDiscounts", url);
    }

    return result;
  }

  async getDiscountFromCouponCode(
    couponCode: string,
  ): Promise<BaseApiResponse<DiscountResponse>> {
    const url = this.baseUrl + `/coupon/${couponCode}`;
    const result: BaseApiResponse<DiscountResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<DiscountResponse>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getDiscountFromCouponCode`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getDiscountFromCouponCode", url);
    }

    return result;
  }

  async createDiscount(
    body: DiscountCreateData,
  ): Promise<BaseApiResponse<DiscountResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<DiscountResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<DiscountResponse>,
        DiscountCreateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createDiscount`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createDiscount", url);
    }

    return result;
  }

  async updateDiscount(
    body: DiscountUpdateData,
    id: string,
  ): Promise<BaseApiResponse<DiscountResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<DiscountResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<DiscountResponse>,
        DiscountUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateDiscount`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateDiscount", url);
    }

    return result;
  }
  async deleteDiscount(id: string): Promise<BaseApiResponse<boolean>> {
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
          `${this.serviceName}: Statuscode is different for deleteDiscount`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "deleteDiscount", url);
    }

    return result;
  }

  async getDiscountDetails(
    id: string,
  ): Promise<BaseApiResponse<DiscountResponse>> {
    const url = this.baseUrl + "/details/" + id;
    const result: BaseApiResponse<DiscountResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<DiscountResponse>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getDiscountDetails`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getDiscountDetails", url);
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

export const discountApiService = new DiscountApiService(baseApi);
