import { Toaster } from "sonner";
import ImageZoomDialog from "./components/compound/ImageZoomDialog";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./logger/ErrorBoundry";
import RouterComponent from "./routes/RouterComponent";
import { FCMProvider } from "./firebase/FCMProvider";
import { SocketProvider } from "./socket/SocketProvider";
import "./styles/index.css";

function App() {
  const { isLoggedIn, isFetching } = useAuth(true);

  return (
    <>
      <ErrorBoundary componentName="pizzaspace">
        <Toaster visibleToasts={6} />
        <ImageZoomDialog />
        <FCMProvider>
          <SocketProvider>
            <div className="flex h-screen w-screen flex-col items-start overflow-hidden">
              {isFetching && (
                <div className="flex h-full w-full items-center justify-center gap-2">
                  <p>Loading application....</p>
                </div>
              )}
              {!isFetching && <RouterComponent isUserLoggedIn={isLoggedIn} />}
            </div>
          </SocketProvider>
        </FCMProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
