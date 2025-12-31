import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  CategoryCreateData,
  CategoryQueryParams,
  CategoryResponse,
  CategoryUpdateData,
  SortOrderUpdateEntry,
} from "@/types/category.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class CategoryApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/category";
  private serviceName: string = "CategoryApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchCategories(
    query: CategoryQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<CategoryResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<CategoryResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<CategoryResponse>>,
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
  async fetchAllCategories(): Promise<BaseApiResponse<CategoryResponse[]>> {
    const url = this.baseUrl + "/all";
    const result: BaseApiResponse<CategoryResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<CategoryResponse[]>>(url);
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
  ): Promise<BaseApiResponse<CategoryResponse[]>> {
    const url = this.baseUrl + "/sort/bulk";
    const result: BaseApiResponse<CategoryResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<CategoryResponse[]>,
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
  async createCategory(
    body: CategoryCreateData,
  ): Promise<BaseApiResponse<CategoryResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<CategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<CategoryResponse>,
        CategoryCreateData
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
  async deleteCategory(id: string): Promise<BaseApiResponse<boolean>> {
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
  async updateCategory(
    body: CategoryUpdateData,
    id: string,
  ): Promise<BaseApiResponse<CategoryResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<CategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<CategoryResponse>,
        CategoryUpdateData
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
  async getCategoryDetails(
    id: string,
  ): Promise<BaseApiResponse<CategoryResponse>> {
    const url = this.baseUrl + "/details/" + id;
    const result: BaseApiResponse<CategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<CategoryResponse>>(url);
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

  async assignStoreToCategory(
    categoryId: string,
    storeIds: string[],
  ): Promise<BaseApiResponse<CategoryResponse>> {
    const url = this.baseUrl + `/${categoryId}/assign-stores`;
    const result: BaseApiResponse<CategoryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<CategoryResponse>,
        { storeIds: string[] }
      >(url, { storeIds });
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for assignStoreToCategory`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "assignStoreToCategory", url);
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

export const categoryApiService = new CategoryApiService(baseApi);
