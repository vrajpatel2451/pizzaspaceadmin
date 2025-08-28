import * as Sentry from "@sentry/react";

export interface LoggerConfig {
  dsn: string;
  environment?: string;
  release?: string;
  sampleRate?: number;
  tracesSampleRate?: number;
  debug?: boolean;
  enableConsole?: boolean;
}

export const initializeLogger = (config: LoggerConfig): void => {
  const {
    dsn,
    environment = process.env.NODE_ENV || "development",
    release = process.env.REACT_APP_VERSION || "1.0.0",
    sampleRate = 1.0,
    tracesSampleRate = environment === "production" ? 0.1 : 1.0,
    debug = environment === "development",
  } = config;

  Sentry.init({
    dsn,
    environment,
    release,
    sampleRate,
    tracesSampleRate,
    debug,

    beforeSend: (event, hint) => {
      if (environment === "development") {
        console.group("🔥 Sentry Event Debug");
        console.log("Event:", event);
        console.log("Hint:", hint);
        console.groupEnd();
      }
      return event;
    },
    beforeBreadcrumb: (breadcrumb) => {
      if (breadcrumb.category === "console" && breadcrumb.level === "debug") {
        return null;
      }
      return breadcrumb;
    },
  });
};
