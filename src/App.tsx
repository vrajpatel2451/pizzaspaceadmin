import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./logger/ErrorBoundry";
import "./styles/index.css";

function App() {
  const { isLoggedIn, isFetching, errorMessage } = useAuth(true);
  return (
    <>
      <ErrorBoundary componentName="pizzaspace">
        <div className="bg-pd-100 text-pd-700">
          LoginResponse: {String(isLoggedIn)} {String(isFetching)}{" "}
          {String(errorMessage)}
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
