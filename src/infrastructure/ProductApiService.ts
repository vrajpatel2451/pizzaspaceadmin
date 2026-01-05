import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { SortOrderUpdateEntry } from "@/types/category.types";
import type { BaseApi } from "@/types/datasource.types";
import type {
  ComboProductSearchItem,
  ComboProductSearchParams,
  ProductAddEditData,
  ProductDetailsResponse,
  ProductQueryParams,
  ProductResponse,
} from "@/types/product.types";
import { baseApi } from "./BaseApi";

class ProductApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/product";
  private serviceName: string = "ProductApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async createProduct(
    body: ProductAddEditData,
  ): Promise<BaseApiResponse<ProductResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<ProductResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    const nBody: Partial<ProductAddEditData> = {
      product: body.product,
    };
    if (body.variantGroups?.length) {
      nBody.variantGroups = body.variantGroups;
      if (body.variants?.length) {
        nBody.variants = body.variants;
        nBody.pricing = body.pricing;
      }
    }
    if (body.deletedGroupIds?.length) {
      nBody.deletedGroupIds = body.deletedGroupIds;
    }
    if (body.deletedIds?.length) {
      nBody.deletedIds = body.deletedIds;
    }
    // Combo groups
    if (body.comboGroups?.length) {
      nBody.comboGroups = body.comboGroups;
    }
    if (body.deletedComboGroupIds?.length) {
      nBody.deletedComboGroupIds = body.deletedComboGroupIds;
    }

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<ProductResponse>,
        Partial<ProductAddEditData>
      >(url, nBody);
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
  async updateProduct(
    body: ProductAddEditData,
    id: string,
  ): Promise<BaseApiResponse<ProductResponse>> {
    const url = this.baseUrl + `/update/${id}`;
    const result: BaseApiResponse<ProductResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    const nBody: Partial<ProductAddEditData> = {
      product: body.product,
    };
    if (body.variantGroups?.length) {
      nBody.variantGroups = body.variantGroups;
      if (body.variants?.length) {
        nBody.variants = body.variants;
        nBody.pricing = body.pricing;
      }
    }
    if (body.deletedGroupIds?.length) {
      nBody.deletedGroupIds = body.deletedGroupIds;
    }
    if (body.deletedIds?.length) {
      nBody.deletedIds = body.deletedIds;
    }
    // Combo groups
    if (body.comboGroups?.length) {
      nBody.comboGroups = body.comboGroups;
    }
    if (body.deletedComboGroupIds?.length) {
      nBody.deletedComboGroupIds = body.deletedComboGroupIds;
    }

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<ProductResponse>,
        Partial<ProductAddEditData>
      >(url, nBody);
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
  async getProduct(
    id: string,
  ): Promise<BaseApiResponse<ProductDetailsResponse>> {
    const url = this.baseUrl + `/details/${id}`;
    const result: BaseApiResponse<ProductDetailsResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<ProductDetailsResponse>>(
          url,
        );
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
  ): Promise<BaseApiResponse<ProductResponse[]>> {
    const url = this.baseUrl + "/sort/bulk";
    const result: BaseApiResponse<ProductResponse[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<ProductResponse[]>,
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
  async getProductList(
    query: ProductQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<ProductResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<ProductResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<ProductResponse>>,
        ProductQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getProductList`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getProductList", url);
    }

    return result;
  }
  async getComboSearchItems(
    query: ComboProductSearchParams,
  ): Promise<BaseApiResponse<PaginatedResponse<ComboProductSearchItem>>> {
    const url = this.baseUrl + "/combo-search";
    const result: BaseApiResponse<PaginatedResponse<ComboProductSearchItem>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<ComboProductSearchItem>>,
        ComboProductSearchParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getComboSearchItems`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getComboSearchItems", url);
    }

    return result;
  }
  async deleteProduct(id: string): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + `/delete/${id}`;
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

  async assignStoreToProduct(
    productId: string,
    storeIds: string[],
  ): Promise<BaseApiResponse<ProductResponse>> {
    const url = this.baseUrl + `/${productId}/assign-stores`;
    const result: BaseApiResponse<ProductResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<ProductResponse>,
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
          `${this.serviceName}: Statuscode is different for assignStoreToProduct`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "assignStoreToProduct", url);
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

export const productApiService = new ProductApiService(baseApi);
