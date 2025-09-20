import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useCanGoBack = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasHistory = window.history.length > 1;
    setCanGoBack(hasHistory);
  }, [location]);

  return canGoBack;
};
