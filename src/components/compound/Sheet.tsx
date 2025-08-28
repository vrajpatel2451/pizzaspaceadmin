import { IconButton } from "../base/IconButton";
import { X } from "lucide-react";
import { cn } from "@/utils/helpers";
import { useEffect, useState, type JSX, type ReactNode } from "react";
import { Button, type ButtonProps } from "../base/Button";

export interface SheetAction {
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
}

interface SheetProps {
  close: () => void;
  isOpen: boolean;
  children: ReactNode;
  title: string;
  subTitle?: string;
  footer?: ReactNode;
  actions?: SheetAction[];
}

const Sheet: React.FC<SheetProps> = (props) => {
  const { children, isOpen, title, subTitle, footer, close, actions } = props;
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        `fixed inset-0 z-50 bg-black/80 backdrop-blur-[1.5px] transition-opacity duration-300`,
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={close}
    >
      <div
        className={cn(
          `fixed top-0 right-0 h-full min-w-md transform p-2 shadow-sm transition-transform duration-300`,
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            `dark:bg-nd-800 m-auto flex h-[98dvh] w-full flex-col rounded-[10px] border border-b bg-white`,
            borderColorClass,
          )}
        >
          {shouldRenderContent && (
            <>
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between border-b",
                  borderColorClass,
                  paddingClass,
                )}
              >
                <div className="flex flex-col gap-1">
                  {title && (
                    <h6 className="text-nl-700 dark:text-nd-50 font-medium">
                      {title}
                    </h6>
                  )}
                  {subTitle && (
                    <p className="text-nl-500 dark:text-nd-200">{subTitle}</p>
                  )}
                </div>
                <IconButton
                  icon={X}
                  size={"xs"}
                  onClick={close}
                  iconClassName="text-nl-700 dark:text-nd-200"
                />
              </div>

              <div className="flex-1 overflow-hidden px-5 py-4">
                <div className="no-scrollbar h-full overflow-y-auto">
                  {children}
                </div>
              </div>

              {footer && (
                <div
                  className={cn(
                    "shrink-0 border-t",
                    paddingClass,
                    borderColorClass,
                  )}
                >
                  {footer}
                </div>
              )}
              {actions && (
                <div
                  className={cn(
                    "flex shrink-0 gap-x-2 border-t",
                    paddingClass,
                    borderColorClass,
                  )}
                >
                  {actions?.map((item, index) => {
                    const { label, ...rest } = item;
                    return (
                      <div
                        className="flex w-full items-center gap-x-1"
                        key={index}
                      >
                        <Button {...rest} key={index} className="grow">
                          {label}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const borderColorClass = `border-nl-200 dark:border-nd-500`;
const paddingClass = `px-5 py-3.5`;

export default Sheet;
