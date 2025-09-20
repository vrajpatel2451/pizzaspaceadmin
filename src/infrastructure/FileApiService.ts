import type { StoreQueryParams } from "@/features/company-management/types/StoreTypes";
import { logger } from "@/logger/core";
import { ServiceErrorHandler } from "@/logger/service-error-handler";
import type {
  BaseApiResponse,
  PaginatedResponse,
  ServerApiResponse,
} from "@/types/baseApi.types";
import type { BaseApi } from "@/types/datasource.types";
import type {
  ChangeFolderRequest,
  DeleteFileRequest,
  FileQueryParams,
  FileResponse,
} from "@/types/file.types";
import { baseApi } from "./BaseApi";

class FileApiService {
  private baseService: BaseApi;
  private baseUrl: string = "/file";
  private serviceName: string = "FileApiService";

  constructor(baseService: BaseApi) {
    this.baseService = baseService;
  }

  async fetchFiles(
    query: FileQueryParams,
  ): Promise<BaseApiResponse<PaginatedResponse<FileResponse>>> {
    const url = this.baseUrl;
    const methodName = "fetchFiles";
    const result: BaseApiResponse<PaginatedResponse<FileResponse>> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.get<
        ServerApiResponse<PaginatedResponse<FileResponse>>,
        StoreQueryParams
      >(url, query);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for ${methodName}`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, methodName, url);
    }

    return result;
  }
  async fetchFileDetails(
    fileId: string,
  ): Promise<BaseApiResponse<FileResponse>> {
    const url = this.baseUrl + `/${fileId}`;
    const methodName = "fetchFileDetails";
    const result: BaseApiResponse<FileResponse> = {
      data: null,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<FileResponse>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for ${methodName}`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, methodName, url);
    }

    return result;
  }
  async fetchAllFolders(): Promise<BaseApiResponse<string[]>> {
    const url = this.baseUrl + "/folders/list";
    const methodName = "fetchAllFolders";
    const result: BaseApiResponse<string[]> = {
      data: [],
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse =
        await this.baseService.get<ServerApiResponse<string[]>>(url);
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for ${methodName}`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, methodName, url);
    }

    return result;
  }
  async deleteFiles(mediaIds: string[]): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + "/delete";
    const methodName = "deleteFiles";
    const result: BaseApiResponse<boolean> = {
      data: false,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<boolean>,
        DeleteFileRequest
      >(url, { mediaIds });
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for ${methodName}`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, methodName, url);
    }

    return result;
  }
  async changeFolder(
    mediaIds: string[],
    folder: string,
  ): Promise<BaseApiResponse<boolean>> {
    const url = this.baseUrl + "/delete";
    const methodName = "changeFolder";
    const result: BaseApiResponse<boolean> = {
      data: false,
      success: false,
      errorMessage: null,
    };

    try {
      const apiResponse = await this.baseService.put<
        ServerApiResponse<boolean>,
        ChangeFolderRequest
      >(url, { mediaIds, folder });
      const { data } = apiResponse;

      if (data.statusCode == 200) {
        result.success = true;
        result.data = data.data;
      } else {
        result.success = false;
        result.errorMessage = data?.errorMessage || "Something went wrong";
        logger.warn(
          `${this.serviceName}: Statuscode is different for ${methodName}`,
          {
            data,
            status: data.statusCode,
          },
        );
      }
    } catch (error) {
      this.handleError(error, result, methodName, url);
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

export const fileApiService = new FileApiService(baseApi);
