import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Divider from "../base/Divider";
import { IconButton } from "../base/IconButton";

interface ContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  bodyClassName?: string;
  headClassName?: string;
  className?: string;
  isOpen?: boolean;
  toggle?: () => void;
  dynamicHeight?: boolean;
}

const Container: React.FC<ContainerProps> = (props) => {
  const {
    children,
    title,
    isCollapsible,
    bodyClassName,
    headClassName,
    defaultOpen,
    className,
    dynamicHeight = false,
  } = props;

  const internalToggle = useToggle(defaultOpen || false);

  const isControlled = props.isOpen !== undefined && props.toggle !== undefined;

  const isOpen = isControlled ? props.isOpen : internalToggle.isOpen;
  const toggle = isControlled ? props.toggle : internalToggle.toggle;
  const [maxHeight, setMaxHeight] = useState("0px");

  const contentRef = useRef<HTMLDivElement>(null);

  const cardBody = () => (
    <div className={cn("px-4 py-3.5", bodyClassName)}>{children}</div>
  );

  const handleOnCollapse = () => {
    if (isCollapsible) {
      if (toggle) {
        toggle();
      }
    }
  };

  useEffect(() => {
    if (isOpen && contentRef.current && dynamicHeight) {
      const newHeight = contentRef.current.scrollHeight;
      setMaxHeight(`${newHeight}px`);
    }
  }, [isOpen, children]);

  return (
    <div className={cn("card", className)}>
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3",
          headClassName,
          isCollapsible && "cursor-pointer select-none",
        )}
        onClick={handleOnCollapse}
      >
        <p className="dark:text-nd-200 text-nl-600 font-medium">
          {title || "Card Title"}
        </p>
        {isCollapsible && (
          <IconButton
            icon={ChevronDown}
            size={"xs"}
            onClick={(e) => {
              e.stopPropagation();
              handleOnCollapse();
            }}
            noDefaultFill
            iconClassName={cn(
              "transition-all",
              isOpen ? "-scale-y-100" : "scale-100",
            )}
          />
        )}
      </div>
      <Divider
        className={cn(
          "transition-opacity",
          isCollapsible && !isOpen && "opacity-0",
          (!isCollapsible || isOpen) && "opacity-100",
        )}
      />
      <>
        {isCollapsible ? (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-in-out",
            )}
            style={{
              maxHeight: isOpen
                ? dynamicHeight
                  ? maxHeight
                  : `${contentRef.current?.scrollHeight || 1000}px`
                : "0px",
            }}
          >
            <div className={cn("px-4 py-3.5", bodyClassName)} ref={contentRef}>
              {" "}
              {children}{" "}
            </div>
          </div>
        ) : (
          cardBody()
        )}
      </>
    </div>
  );
};

export default Container;
