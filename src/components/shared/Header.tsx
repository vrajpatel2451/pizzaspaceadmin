import { useCanGoBack } from "@/hooks/useCanGoBack";
import { routeHandler, type SFRouteProps } from "@/routes/routeHendler";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton } from "../base/IconButton";

const Header = () => {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const { options } = useMemo<Partial<SFRouteProps>>(
    () => routeHandler.getRouteByMatch(pathname) || {},
    [pathname]
  );
  const title = options?.name || "Page Not Found";
  const hideBackButton = options?.hideBackButton || false;
  const canGoBack = useCanGoBack();

  return (
    <div className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-x-3">
        {!hideBackButton && canGoBack && (
          <IconButton
            icon={ArrowLeft}
            size={"sm"}
            className="border border-slate-200 bg-white hover:bg-slate-50"
            iconClassName="text-slate-500"
            strokeWidth={2}
            onClick={() => nav(-1)}
          />
        )}
        <h4 className="text-left text-lg font-semibold text-slate-800">
          {title}
        </h4>
      </div>
    </div>
  );
};

export default Header;
