import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type {
  SocialMediaCreateData,
  SocialMediaResponse,
  SocialMediaUpdateData,
} from "@/types/socialMedia.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class SocialMediaApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/socialmedia";
  private serviceName: string = "SocialMediaApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchSocialMediaList(): Promise<BaseApiResponse<SocialMediaResponse[]>> {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<SocialMediaResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<SocialMediaResponse[]>
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
      this.handleError(error, result, "fetchSocialMediaList", url);
    }

    return result;
  }

  async createSocialMedia(
    body: SocialMediaCreateData
  ): Promise<BaseApiResponse<SocialMediaResponse>> {
    const url = `${this.baseUrl}/create`;
    const result: BaseApiResponse<SocialMediaResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<SocialMediaResponse>,
        SocialMediaCreateData
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
      this.handleError(error, result, "createSocialMedia", url);
    }

    return result;
  }

  async updateSocialMedia(
    id: string,
    body: SocialMediaUpdateData
  ): Promise<BaseApiResponse<SocialMediaResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<SocialMediaResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<SocialMediaResponse>,
        SocialMediaUpdateData
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
      this.handleError(error, result, "updateSocialMedia", url);
    }

    return result;
  }

  async deleteSocialMedia(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deleteSocialMedia", url);
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

export const socialMediaApiService = new SocialMediaApiService(baseApi);
