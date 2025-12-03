import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  ContactQueryQueryParams,
  ContactQueryResponse,
  ContactQueryUpdateData,
} from "@/types/contactQuery.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class ContactQueryApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/contact-queries";
  private serviceName: string = "ContactQueryApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchContactQueriesList(
    query: ContactQueryQueryParams
  ): Promise<BaseApiResponse<PaginatedResponse<ContactQueryResponse>>> {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<PaginatedResponse<ContactQueryResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<ContactQueryResponse>>,
        ContactQueryQueryParams
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
      this.handleError(error, result, "fetchContactQueriesList", url);
    }

    return result;
  }

  async updateContactQuery(
    id: string,
    body: ContactQueryUpdateData
  ): Promise<BaseApiResponse<ContactQueryResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<ContactQueryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<ContactQueryResponse>,
        ContactQueryUpdateData
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
      this.handleError(error, result, "updateContactQuery", url);
    }

    return result;
  }

  async deleteContactQuery(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deleteContactQuery", url);
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

export const contactQueryApiService = new ContactQueryApiService(baseApi);
