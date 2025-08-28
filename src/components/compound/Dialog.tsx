import { IconButton } from "../base/IconButton";
import { X } from "lucide-react";
import { cn } from "@/utils/helpers";
import { useEffect, useState, type JSX, type ReactNode } from "react";
import { Button, type ButtonProps } from "../base/Button";
import { createPortal } from "react-dom";

const Dialog: React.FC<DialogProps> = (props) => {
  const {
    children,
    isOpen,
    title,
    subTitle,
    close,
    actions,
    size = "md",
  } = props;
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const dialogContent = (
    <div
      className={cn(
        `fall fixed inset-0 z-[101] bg-black/80 backdrop-blur-[1.5px] transition-all duration-200`,
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
      onClick={close}
    >
      <div
        className={cn(
          `dark:bg-nd-800 border-nl-200 dark:border-nd-500 m-auto flex w-full flex-col rounded-xl border bg-white shadow-lg`,
          sizeMap[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {shouldRenderContent && (
          <>
            <div
              className={cn(
                "flex shrink-0 items-center justify-between",
                paddingClass,
              )}
            >
              <div className="flex flex-col">
                {title && (
                  <h5 className="text-nl-700 dark:text-nd-50 font-medium">
                    {title}
                  </h5>
                )}
                {subTitle && (
                  <p className="text-nl-500 dark:text-nd-200 mt-0.5">
                    {subTitle}
                  </p>
                )}
              </div>
              <IconButton icon={X} iconSize={18} size={"xs"} onClick={close} />
            </div>

            <div className="flex-1 overflow-hidden px-5 py-4">
              <div className="no-scrollbar h-full overflow-y-auto">
                {children}
              </div>
            </div>

            {actions && (
              <div
                className={cn(
                  "flex shrink-0 justify-end gap-x-2",
                  paddingClass,
                )}
              >
                {actions?.tertiary && (
                  <Button
                    disabled={actions?.tertiary?.disabled}
                    onClick={actions?.tertiary?.onClick}
                    startIcon={actions?.tertiary?.startIcon}
                    endIcon={actions?.tertiary?.endIcon}
                    size={actions?.tertiary?.size}
                    variant={actions?.tertiary?.variant || "ghost"}
                    color={actions?.tertiary?.color || "neutral"}
                    className={actions.tertiary.className}
                    isLoading={actions?.tertiary?.loading}
                  >
                    {actions?.tertiary?.label}
                  </Button>
                )}
                {actions?.secondary && (
                  <Button
                    disabled={actions?.secondary?.disabled}
                    onClick={actions?.secondary?.onClick}
                    startIcon={actions?.secondary?.startIcon}
                    endIcon={actions?.secondary?.endIcon}
                    size={actions?.secondary?.size}
                    variant={actions?.secondary?.variant || "ghost"}
                    color={actions?.secondary?.color || "neutral"}
                    className={actions.secondary.className}
                    isLoading={actions?.secondary?.loading}
                  >
                    {actions?.secondary?.label}
                  </Button>
                )}
                {actions?.primary && (
                  <Button
                    disabled={actions?.primary?.disabled}
                    onClick={actions?.primary?.onClick}
                    startIcon={actions?.primary?.startIcon}
                    size={actions?.primary?.size}
                    endIcon={actions?.primary?.endIcon}
                    className={actions?.primary?.className}
                    isLoading={actions?.primary?.loading}
                    variant={actions?.primary?.variant || "filled"}
                    color={actions?.primary?.color || "primary"}
                  >
                    {actions?.primary?.label}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(dialogContent, document.body);
  }

  return null;
};

const sizeMap = {
  sm: "w-[95%] max-w-sm",
  md: "w-[95%] max-w-2xl",
  lg: "w-[95%] max-w-4xl",
  xl: "w-[95%] max-w-7xl",
  full: "w-[98%]",
};
const paddingClass = `px-5 py-4`;

export default Dialog;

export interface DialogActions {
  primary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    fullWidth?: boolean;
    loading?: boolean;
    className?: string;
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];
    color?: ButtonProps["color"];
  };
  secondary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    fullWidth?: boolean;
    loading?: boolean;
    className?: string;
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];
    color?: ButtonProps["color"];
  };
  tertiary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    fullWidth?: boolean;
    loading?: boolean;
    className?: string;
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];
    color?: ButtonProps["color"];
  };
}

export interface DialogProps {
  close: () => void;
  isOpen: boolean;
  children: ReactNode;
  title: string;
  subTitle?: string;
  actions?: DialogActions;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}
