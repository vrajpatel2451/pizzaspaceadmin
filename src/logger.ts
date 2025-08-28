import * as Sentry from "@sentry/react";

export const logError = (error: unknown, context?: Record<string, any>) => {
  if (context?.endpoint) {
    Sentry.setTag("api.endpoint", context.endpoint);
  }
  if (context?.method) {
    Sentry.setTag("api.method", context.method);
  }
  Sentry.captureException(error, { extra: context });
  console.error(error, context);
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, {
    level: "warning",
    extra: context,
  });
  console.warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, {
    level: "info",
    extra: context,
  });
  console.info(message, context);
};
