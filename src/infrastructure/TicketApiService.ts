import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import type {
  OrderTicketResponse,
  OrderTicketQueryParams,
  ChangeTicketStatusData,
  UpdateClosingMessageData,
} from "@/types/ticket.types";
import { baseApi } from "./BaseApi";

class TicketApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/ticket";
  private serviceName: string = "TicketApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchOrderTickets(
    query: OrderTicketQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<OrderTicketResponse>>> {
    const url = `${this.baseUrl}/order-tickets`;
    const result: BaseApiResponse<PaginatedResponse<OrderTicketResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<OrderTicketResponse>>,
        OrderTicketQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for fetchOrderTickets`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "fetchOrderTickets", url);
    }

    return result;
  }

  async changeTicketStatus(
    ticketId: string,
    body: ChangeTicketStatusData,
  ): Promise<BaseApiResponse<OrderTicketResponse>> {
    const url = `${this.baseUrl}/change-status/${ticketId}`;
    const result: BaseApiResponse<OrderTicketResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<OrderTicketResponse>,
        ChangeTicketStatusData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for changeTicketStatus`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "changeTicketStatus", url);
    }

    return result;
  }

  async updateClosingMessage(
    ticketId: string,
    body: UpdateClosingMessageData,
  ): Promise<BaseApiResponse<OrderTicketResponse>> {
    const url = `${this.baseUrl}/change-message/${ticketId}`;
    const result: BaseApiResponse<OrderTicketResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<OrderTicketResponse>,
        UpdateClosingMessageData
      >(url, body);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for updateClosingMessage`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, "updateClosingMessage", url);
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

export const ticketApiService = new TicketApiService(baseApi);
