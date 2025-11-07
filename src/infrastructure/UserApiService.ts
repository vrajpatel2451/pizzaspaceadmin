import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import type {
  CreateUserData,
  UserQueryParams,
  UserResponse,
} from "@/types/user.types";
import { baseApi } from "./BaseApi";

class UserApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/user";
  private serviceName: string = "UserApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async getUserList(
    queryParams: UserQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<UserResponse>>> {
    const url = this.baseUrl + "/list";
    const result: BaseApiResponse<PaginatedResponse<UserResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<UserResponse>>,
        UserQueryParams
      >(url, queryParams);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getUserList`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getUserList", url);
    }

    return result;
  }

  async createUser(
    body: CreateUserData,
  ): Promise<BaseApiResponse<UserResponse>> {
    const url = this.baseUrl + "/admin";
    const result: BaseApiResponse<UserResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<UserResponse>,
        CreateUserData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200 || data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for createUser`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "createUser", url);
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

export const userApiService = new UserApiService(baseApi);
