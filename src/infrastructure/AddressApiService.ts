import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import type { AddressResponse, CreateAddressData } from "@/types/user.types";
import { baseApi } from "./BaseApi";

class AddressApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/user/address";
  private serviceName: string = "AddressApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async getAddressesByUser(
    userId: string,
  ): Promise<BaseApiResponse<AddressResponse[]>> {
    const url = this.baseUrl + `/admin/${userId}`;
    const result: BaseApiResponse<AddressResponse[]> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<AddressResponse[]>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getAddressesByUser`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getAddressesByUser", url);
    }

    return result;
  }

  async createAddress(
    body: CreateAddressData,
    userId: string,
  ): Promise<BaseApiResponse<AddressResponse>> {
    const url = this.baseUrl + `/admin/${userId}/create`;
    const result: BaseApiResponse<AddressResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<AddressResponse>,
        CreateAddressData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200 || data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createAddress`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createAddress", url);
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

export const addressApiService = new AddressApiService(baseApi);
