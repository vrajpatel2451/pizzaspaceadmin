import { Toaster } from "sonner";
import ImageZoomDialog from "./components/compound/ImageZoomDialog";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./logger/ErrorBoundry";
import RouterComponent from "./routes/RouterComponent";
import "./styles/index.css";

function App() {
  const { isLoggedIn, isFetching } = useAuth(true);

  return (
    <>
      <ErrorBoundary componentName="foodboss_seller">
        <Toaster visibleToasts={6} />
        <ImageZoomDialog />
        <div className="flex h-screen w-screen flex-col items-start overflow-hidden">
          {isFetching && (
            <div className="flex h-full w-full items-center justify-center gap-2">
              <p>Loading application....</p>
            </div>
          )}
          {!isFetching && <RouterComponent isUserLoggedIn={isLoggedIn} />}
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
