import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "http",
  // enabled: false,
  enabled: import.meta.env.PROD,
  sendDefaultPii: true,
  integrations: (integrations) =>
    integrations.filter((integration) => integration.name !== "CaptureConsole"),
});
