import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  CategoryQueryParams,
  SortOrderUpdateEntry,
  SubCategoryCreateData,
  SubCategoryResponse,
  SubCategoryUpdateData,
} from "@/types/category.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class SubCategoryApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/sub-category";
  private serviceName: string = "SubCategoryApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchSubCategories(
    query: CategoryQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<SubCategoryResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<SubCategoryResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<SubCategoryResponse>>,
        CategoryQueryParams
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
  async createSubCategory(
    body: SubCategoryCreateData,
  ): Promise<BaseApiResponse<SubCategoryResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<SubCategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<SubCategoryResponse>,
        SubCategoryCreateData
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
  async deleteSubCategory(id: string): Promise<BaseApiResponse<boolean>> {
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
  async updateSubCategory(
    body: SubCategoryUpdateData,
    id: string,
  ): Promise<BaseApiResponse<SubCategoryResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<SubCategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<SubCategoryResponse>,
        SubCategoryUpdateData
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
  async getSubCategoryDetails(
    id: string,
  ): Promise<BaseApiResponse<SubCategoryResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<SubCategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<SubCategoryResponse>>(url);
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
  async sortBulk(
    bulkEntry: SortOrderUpdateEntry[],
  ): Promise<BaseApiResponse<SubCategoryResponse[]>> {
    const url = this.baseUrl + "/sort/bulk";
    const result: BaseApiResponse<SubCategoryResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<SubCategoryResponse[]>,
        { data: SortOrderUpdateEntry[] }
      >(url, {
        data: bulkEntry,
      });
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

export const subCategoryApiService = new SubCategoryApiService(baseApi);
