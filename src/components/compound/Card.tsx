import { ChevronDown } from "lucide-react";
import Divider from "../base/Divider";
import { cn } from "@/utils/helpers";
import { IconButton } from "../base/IconButton";
import { useToggle } from "@/hooks/useToggle";
import { useRef, type ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  bodyClassName?: string;
  headClassName?: string;
  className?: string;
}

const Card: React.FC<CardProps> = (props) => {
  const {
    children,
    title,
    isCollapsible,
    bodyClassName,
    headClassName,
    defaultOpen,
    className,
  } = props;

  const { isOpen, toggle } = useToggle(defaultOpen || false);
  const contentRef = useRef<HTMLDivElement>(null);

  const cardBody = () => (
    <div className={cn("px-4 py-3.5", bodyClassName)}>{children}</div>
  );

  return (
    <div className={cn("card", className)}>
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3",
          headClassName,
        )}
      >
        <p className="dark:text-nd-200 text-nl-600 font-medium">
          {title || "Card Title"}
        </p>
        {isCollapsible && (
          <IconButton
            icon={ChevronDown}
            size={"xs"}
            onClick={toggle}
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
                ? `${contentRef.current?.scrollHeight || 1000}px`
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

export default Card;
