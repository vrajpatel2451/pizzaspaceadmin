import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import { logger } from "@sentry/react";
import { baseApi } from "./BaseApi";
import type {
  StaffLoginData,
  StaffRegistrationData,
  StaffResponse,
  StaffResponseWithToken,
} from "@/types/user.types";
import { LocalStorageUtil } from "@/utils/localStorageUtil";

class AuthApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/staff";
  private serviceName: string = "AuthService";
  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async login(
    loginRequest: StaffLoginData,
  ): Promise<BaseApiResponse<StaffResponse>> {
    const url = this.baseUrl + "/login";
    const result: BaseApiResponse<StaffResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };
    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<StaffResponseWithToken>,
        StaffLoginData
      >(url, loginRequest);
      const { data, status } = apiResponse;
      if (status == 201) {
        LocalStorageUtil.setItem(
          "staff_access_token",
          data.data.tokens.accessToken,
        );
        LocalStorageUtil.setItem(
          "staff_refresh_token",
          data.data.tokens.refreshToken,
        );
        result.success = true;
        result.data = data.data.staff;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Statuscode is different for login`, {
          data,
          status,
        });
      }
    } catch (error) {
      this.handleError(error, result, "login", url);
    }
    return result;
  }
  async register(
    registerRequest: StaffRegistrationData,
    allowRegister?: boolean,
  ): Promise<BaseApiResponse<StaffResponse>> {
    const url = this.baseUrl + "/register";
    const result: BaseApiResponse<StaffResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };
    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<StaffResponseWithToken>,
        StaffLoginData
      >(url, registerRequest);
      const { data, status } = apiResponse;
      if (status == 201) {
        if (allowRegister) {
          LocalStorageUtil.setItem(
            "staff_access_token",
            data.data.tokens.accessToken,
          );
          LocalStorageUtil.setItem(
            "staff_refresh_token",
            data.data.tokens.refreshToken,
          );
        }
        result.success = true;
        result.data = data.data.staff;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for register`,
          {
            data,
            status,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "register", url);
    }
    return result;
  }
  async profile(): Promise<BaseApiResponse<StaffResponse>> {
    const url = this.baseUrl + "/profile";
    const result: BaseApiResponse<StaffResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };
    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<StaffResponseWithToken>>(
          url,
        );
      const { data, status } = apiResponse;
      if (status == 200) {
        result.success = true;
        result.data = data.data.staff;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for profile`,
          {
            data,
            status,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "profile", url);
    }
    return result;
  }

  async logout(): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + "/logout";
    const result: BaseApiResponse<boolean> = {
      data: null,
      success: false,
      errorMessage: null,
    };
    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<boolean>,
        any
      >(url);
      const { data, status } = apiResponse;
      if (status == 201) {
        result.success = true;
        result.data = true;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(`${this.serviceName}: Statuscode is different for logout`, {
          data,
          status,
        });
      }
    } catch (error) {
      this.handleError(error, result, "logout", url);
    }
    return result;
  }
  async logoutFromAllDevices(
    staffId?: string,
  ): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + "/logout-all-devices";
    const result: BaseApiResponse<boolean> = {
      data: null,
      success: false,
      errorMessage: null,
    };
    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<boolean>,
        { staffId?: string }
      >(url, { staffId });
      const { data, status } = apiResponse;
      if (status == 201) {
        result.success = true;
        result.data = true;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for logoutFromAllDevices`,
          {
            data,
            status,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "logoutFromAllDevices", url);
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

export const authApiService = new AuthApiService(baseApi);
