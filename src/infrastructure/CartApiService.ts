import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  CartCreateData,
  CartQueryParams,
  CartResponse,
  CartUpdateData,
} from "@/types/cart.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";
import type {
  CustomerBillingOnCart,
  PricingForCartParamsForAdmin,
} from "@/types/pricing.types";

class CartApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/cart";
  private serviceName: string = "CartApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchCartItems(
    query: CartQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<CartResponse>>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<PaginatedResponse<CartResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<CartResponse>>,
        CartQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchCartItems`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchCartItems", url);
    }

    return result;
  }

  async addToCart(
    body: CartCreateData,
  ): Promise<BaseApiResponse<CartResponse>> {
    const url = this.baseUrl;
    const result: BaseApiResponse<CartResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    const nBody = { ...body };
    if (!body.variantId) {
      delete nBody.variantId;
    }

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<CartResponse>,
        CartCreateData
      >(url, nBody);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for addToCart`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "addToCart", url);
    }

    return result;
  }

  async updateCartItem(
    body: CartUpdateData,
    id: string,
  ): Promise<BaseApiResponse<CartResponse>> {
    const url = this.baseUrl + "/" + id;
    const result: BaseApiResponse<CartResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<CartResponse>,
        CartUpdateData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateCartItem`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateCartItem", url);
    }

    return result;
  }

  async removeFromCart(id: string): Promise<BaseApiResponse<boolean>> {
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
          `${this.serviceName}: Statuscode is different for removeFromCart`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "removeFromCart", url);
    }

    return result;
  }
  async getSummary(
    body: PricingForCartParamsForAdmin,
  ): Promise<BaseApiResponse<CustomerBillingOnCart>> {
    const url = this.baseUrl + "/summary";
    const result: BaseApiResponse<CustomerBillingOnCart> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    const nBody = { ...body };
    if (!nBody.discountIds?.length) {
      delete nBody.discountIds;
    }
    if (!nBody.addressId) {
      delete nBody.addressId;
    }

    try {
      const apiResponse = await this.baseService.post<
        ServerApiResponse<CustomerBillingOnCart>,
        PricingForCartParamsForAdmin
      >(url, nBody);
      const { data } = apiResponse;

      if (data.statusCode == 201) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for getSummary`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "getSummary", url);
    }

    return result;
  }

  async updateUser(
    userId: string,
    cartIds: string[],
  ): Promise<BaseApiResponse<CartResponse[]>> {
    const url = this.baseUrl + "/assign-user";
    const result: BaseApiResponse<CartResponse[]> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    const body = { userId, cartIds };

    try {
      const apiResponse = await this.baseService.patch<
        ServerApiResponse<CartResponse[]>,
        { userId: string; cartIds: string[] }
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateUser`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateUser", url);
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

export const cartApiService = new CartApiService(baseApi);
