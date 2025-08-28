import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { useRef, type ReactNode } from "react";

interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  classname?: string;
  bodyClassname?: string;
  defaultOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = (props) => {
  const {
    children,
    classname,
    trigger,
    defaultOpen = false,
    bodyClassname,
  } = props;

  const { isOpen, toggle } = useToggle(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn(classname)}>
      <div onClick={toggle}> {trigger} </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          bodyClassname,
        )}
        style={{
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight || 1000}px`
            : "0px",
        }}
      >
        <div ref={contentRef}> {children} </div>
      </div>
    </div>
  );
};

export default Collapsible;
