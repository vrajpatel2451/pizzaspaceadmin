import { Button } from "@/components/base/Button";
import { routeConstants } from "@/routes/routeConstants";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * 403 Forbidden Page
 * Displayed when a user tries to access a route they don't have permission for
 */
const ForbiddenPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(routeConstants.dashboard);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <ShieldX className="text-red-500" size={80} strokeWidth={1.5} />
      <div className="text-center">
        <h1 className="text-nl-800 dark:text-nd-100 text-3xl font-bold">
          403 - Access Denied
        </h1>
        <p className="text-nl-600 dark:text-nd-300 mt-2 text-lg">
          You do not have permission to access this page.
        </p>
        <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button onClick={handleGoHome}>Go to Dashboard</Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
