import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  AddAddonBulkGetParams,
  AddonApiResponse,
  AddonBulkGetParams,
  AddonWriteApiResponse,
  EditAddonBulkGetParams,
} from "@/types/addon.types";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class AddonApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/product";
  private serviceName: string = "AddonApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async createAddon(
    body: AddAddonBulkGetParams,
  ): Promise<BaseApiResponse<AddonWriteApiResponse>> {
    const url = this.baseUrl + "/addons-group-bulk";
    const result: BaseApiResponse<AddonWriteApiResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<AddonWriteApiResponse>,
        AddAddonBulkGetParams
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createAddon`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createAddon", url);
    }
    return result;
  }
  async editAddon(
    body: EditAddonBulkGetParams,
  ): Promise<BaseApiResponse<AddonWriteApiResponse>> {
    const url = this.baseUrl + "/addons-group-bulk";
    const result: BaseApiResponse<AddonWriteApiResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<AddonWriteApiResponse>,
        EditAddonBulkGetParams
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for editAddon`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "editAddon", url);
    }
    return result;
  }
  async deleteGroup(id: string): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + `/addon-groups/${id}`;
    const result: BaseApiResponse<boolean> = {
      data: null,
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
          `${this.serviceName}: Statuscode is different for deleteGroup`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "deleteGroup", url);
    }
    return result;
  }
  async getAddonList(
    body: AddonBulkGetParams,
  ): Promise<BaseApiResponse<AddonApiResponse>> {
    const url = this.baseUrl + "/addons-group-bulk";
    const result: BaseApiResponse<AddonApiResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<AddonApiResponse>,
        AddonBulkGetParams
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getAddonList`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getAddonList", url);
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

export const addonApiService = new AddonApiService(baseApi);
