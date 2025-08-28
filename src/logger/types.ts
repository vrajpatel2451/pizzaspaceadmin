export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warning",
  ERROR = "error",
  CRITICAL = "fatal",
}

export interface ApiLogData {
  requestId: string;
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  duration?: number;
  request?: {
    headers?: Record<string, any>;
    data?: any;
    params?: any;
  };
  response?: {
    headers?: Record<string, any>;
    data?: any;
  };
  error?: Error | null;
  timestamp: string;
}

export interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  feature?: string;
  action?: string;
  [key: string]: any;
}

export interface LogTags {
  level?: string;
  component?: string;
  api_endpoint?: string;
  status_code?: string;
  request_id?: string;
  method?: string;
  error_type?: string;
  [key: string]: string | undefined;
}
