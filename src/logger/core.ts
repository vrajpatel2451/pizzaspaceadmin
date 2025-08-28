import * as Sentry from "@sentry/react";
import {
  LogLevel,
  type ApiLogData,
  type LogContext,
  type LogTags,
} from "./types";
import { sanitizeData, truncateData } from "./utils";

class Logger {
  private globalContext: LogContext = {};
  private globalTags: LogTags = {};
  private enableConsole: boolean;

  constructor(enableConsole = true) {
    this.enableConsole = enableConsole;
  }

  setGlobalContext(context: LogContext): void {
    this.globalContext = { ...this.globalContext, ...context };
    Sentry.setContext("global", this.globalContext);
  }

  setGlobalTags(tags: LogTags): void {
    this.globalTags = { ...this.globalTags, ...tags };
    Sentry.setTags(tags);
  }

  setUser(user: {
    id?: string;
    email?: string;
    username?: string;
    [key: string]: any;
  }): void {
    const sanitizedUser = sanitizeData(user);
    Sentry.setUser(sanitizedUser);
    this.setGlobalContext({ user: sanitizedUser });
  }

  private log(
    level: LogLevel,
    message: string,
    context: LogContext = {},
    tags: LogTags = {},
    error?: Error,
  ): void {
    const timestamp = new Date().toISOString();
    const logData = {
      level,
      message,
      context: sanitizeData({ ...this.globalContext, ...context }),
      tags: { ...this.globalTags, level, ...tags },
      timestamp,
      error,
    };

    // Console logging
    if (this.enableConsole) {
      this.logToConsole(logData);
    }

    // Sentry logging
    this.logToSentry(logData);
  }

  private logToConsole(logData: any): void {
    const { level, message, context, tags, error } = logData;

    console.group(`[${level.toUpperCase()}] ${message}`);

    if (Object.keys(context).length > 0) {
      console.log("Context:", context);
    }
    if (Object.keys(tags).length > 0) {
      console.log("Tags:", tags);
    }
    if (error) {
      console.error("Error:", error);
    }

    console.groupEnd();
  }

  private logToSentry(logData: any): void {
    const { level, message, context, tags, error } = logData;

    Sentry.withScope((scope) => {
      // Set level
      scope.setLevel(level as Sentry.SeverityLevel);

      // Set tags
      Object.entries(tags).forEach(([key, value]) => {
        if (value) scope.setTag(key, String(value));
      });

      // Set context
      if (Object.keys(context).length > 0) {
        scope.setContext("log_context", context);
      }

      // Capture error or message
      if (error) {
        scope.setContext("error_details", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(message, level as Sentry.SeverityLevel);
      }
    });
  }

  debug(message: string, context?: LogContext, tags?: LogTags): void {
    this.log(LogLevel.DEBUG, message, context, tags);
  }

  info(message: string, context?: LogContext, tags?: LogTags): void {
    this.log(LogLevel.INFO, message, context, tags);
  }

  warn(message: string, context?: LogContext, tags?: LogTags): void {
    this.log(LogLevel.WARN, message, context, tags);
  }

  error(
    message: string,
    error?: Error,
    context?: LogContext,
    tags?: LogTags,
  ): void {
    this.log(LogLevel.ERROR, message, context, tags, error);
  }

  critical(
    message: string,
    error?: Error,
    context?: LogContext,
    tags?: LogTags,
  ): void {
    this.log(LogLevel.CRITICAL, message, context, tags, error);
  }

  apiLog(data: ApiLogData, isError: boolean = false): void {
    const level = isError ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API ${data.method} ${data.url} - ${data.status || "UNKNOWN"}`;

    const context: LogContext = {
      api: {
        requestId: data.requestId,
        method: data.method,
        url: data.url,
        status: data.status,
        statusText: data.statusText,
        duration: data.duration,
        request: sanitizeData(truncateData(data.request)),
        response: sanitizeData(truncateData(data.response, 500)),
        timestamp: data.timestamp,
      },
    };

    const tags: LogTags = {
      api_call: "true",
      method: data.method,
      request_id: data.requestId,
      api_endpoint: data.url.split("/").pop() || "unknown",
      ...(data.status && { status_code: data.status.toString() }),
      ...(isError && { error_type: data.error?.name || "api_error" }),
    };

    this.log(level, message, context, tags, data.error as any);
  }

  addBreadcrumb(
    message: string,
    category: string = "manual",
    data: any = {},
  ): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level: "info",
      data: sanitizeData(data),
      timestamp: Date.now() / 1000,
    });
  }
}

export const logger = new Logger();
