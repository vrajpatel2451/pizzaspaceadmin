import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type { BaseApiResponse, ServerApiResponse } from "@/types/baseApi.types";
import type {
  PolicyCreateData,
  PolicyListResponse,
  PolicyResponse,
  PolicyUpdateData,
} from "@/types/policy.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class PolicyApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/policies";
  private serviceName: string = "PolicyApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchPoliciesList(): Promise<BaseApiResponse<PolicyListResponse[]>> {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<PolicyListResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PolicyListResponse[]>
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
      this.handleError(error, result, "fetchPoliciesList", url);
    }

    return result;
  }

  async fetchPolicyBySlug(slug: string): Promise<BaseApiResponse<PolicyResponse | null>> {
    const url = `${this.baseUrl}/details/${slug}`;
    const result: BaseApiResponse<PolicyResponse | null> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PolicyResponse | null>
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
      this.handleError(error, result, "fetchPolicyBySlug", url);
    }

    return result;
  }

  async fetchPolicyById(id: string): Promise<BaseApiResponse<PolicyResponse>> {
    const url = `${this.baseUrl}/details/id/${id}`;
    const result: BaseApiResponse<PolicyResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PolicyResponse>
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
      this.handleError(error, result, "fetchPolicyById", url);
    }

    return result;
  }

  async createPolicy(
    body: PolicyCreateData
  ): Promise<BaseApiResponse<PolicyResponse>> {
    const url = `${this.baseUrl}/create`;
    const result: BaseApiResponse<PolicyResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<PolicyResponse>,
        PolicyCreateData
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
      this.handleError(error, result, "createPolicy", url);
    }

    return result;
  }

  async updatePolicy(
    id: string,
    body: PolicyUpdateData
  ): Promise<BaseApiResponse<PolicyResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<PolicyResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<PolicyResponse>,
        PolicyUpdateData
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
      this.handleError(error, result, "updatePolicy", url);
    }

    return result;
  }

  async deletePolicy(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deletePolicy", url);
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

export const policyApiService = new PolicyApiService(baseApi);
