import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type {
  ReservationQueryQueryParams,
  ReservationQueryResponse,
  ReservationQueryUpdateData,
} from "@/types/reservationQuery.types";
import type { BaseApi } from "@/types/datasource.types";
import { baseApi } from "./BaseApi";

class ReservationQueryApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/reservation-form";
  private serviceName: string = "ReservationQueryApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchReservationQueriesList(
    query: ReservationQueryQueryParams
  ): Promise<BaseApiResponse<PaginatedResponse<ReservationQueryResponse>>> {
    const url = `${this.baseUrl}/list`;
    const result: BaseApiResponse<PaginatedResponse<ReservationQueryResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<ReservationQueryResponse>>,
        ReservationQueryQueryParams
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
      this.handleError(error, result, "fetchReservationQueriesList", url);
    }

    return result;
  }

  async updateReservationQuery(
    id: string,
    body: ReservationQueryUpdateData
  ): Promise<BaseApiResponse<ReservationQueryResponse>> {
    const url = `${this.baseUrl}/edit/${id}`;
    const result: BaseApiResponse<ReservationQueryResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<ReservationQueryResponse>,
        ReservationQueryUpdateData
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
      this.handleError(error, result, "updateReservationQuery", url);
    }

    return result;
  }

  async deleteReservationQuery(id: string): Promise<BaseApiResponse<boolean>> {
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
      this.handleError(error, result, "deleteReservationQuery", url);
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

export const reservationQueryApiService = new ReservationQueryApiService(baseApi);
