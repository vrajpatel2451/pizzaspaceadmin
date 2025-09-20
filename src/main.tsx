import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
// import "./sentry.ts";
import App from "./App.tsx";
import { initializeLogger } from "./logger/config.ts";
import { logger } from "./logger/core.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";

// initializeLogger({
//   dsn: import.meta.env.SENTRY_DSN,
// });
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement, {
    onUncaughtError: Sentry.reactErrorHandler((error) => {
      logger.error("AppError: Uncaught", error, {
        component: "main",
        feature: "main",
      });
    }),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  });
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  );
}
