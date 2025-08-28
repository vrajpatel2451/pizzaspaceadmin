import React from "react";
import { logger } from "./core";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.critical(
      "React Error Boundary triggered",
      error,
      {
        component: this.props.componentName,
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
      {
        component: this.props.componentName,
        error_type: "react_error",
        react_error: "true",
      },
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <p>The error has been reported automatically.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
