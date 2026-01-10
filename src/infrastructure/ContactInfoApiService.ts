import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  ContactInfoCreateData,
  ContactInfoQueryParams,
  ContactInfoResponse,
  ContactInfoUpdateData,
} from "@/types/contactInfo.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class ContactInfoApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/contact-info";
  private serviceName: string = "ContactInfoApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchContactInfoList(
    query: ContactInfoQueryParams
  ): Promise<BaseApiResponse<PaginatedResponse<ContactInfoResponse>>> {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<PaginatedResponse<ContactInfoResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<ContactInfoResponse>>,
        ContactInfoQueryParams
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
      this.handleError(error, result, "fetchContactInfoList", url);
    }

    return result;
  }

  async createContactInfo(
    body: ContactInfoCreateData
  ): Promise<BaseApiResponse<ContactInfoResponse>> {
    const url = `${this.baseUrl}/create`;
    const result: BaseApiResponse<ContactInfoResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<ContactInfoResponse>,
        ContactInfoCreateData
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
      this.handleError(error, result, "createContactInfo", url);
    }

    return result;
  }

  async updateContactInfo(
    id: string,
    body: ContactInfoUpdateData
  ): Promise<BaseApiResponse<ContactInfoResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<ContactInfoResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<ContactInfoResponse>,
        ContactInfoUpdateData
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
      this.handleError(error, result, "updateContactInfo", url);
    }

    return result;
  }

  async deleteContactInfo(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deleteContactInfo", url);
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

export const contactInfoApiService = new ContactInfoApiService(baseApi);
