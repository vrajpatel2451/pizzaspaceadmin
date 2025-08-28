import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";
import React, { useEffect, useRef, useState, type ReactNode } from "react";

export interface TabButtonListItem {
  label: string;
  value: string;
  startIcon?: keyof typeof LucideIcons;
  endIcon?: keyof typeof LucideIcons;
}

interface TabProps {
  buttonList: TabButtonListItem[];
  selected: TabButtonListItem;
  onChange: (value: TabButtonListItem) => void;
  fullWidth?: boolean;
  containerClassname?: string;
  buttonClassname?: string;
}

const Tabs: React.FC<TabProps> = (props) => {
  const {
    buttonList,
    onChange,
    selected,
    fullWidth,
    containerClassname,
    buttonClassname,
  } = props;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const index = buttonList.findIndex((b) => b.value === selected.value);
    const button = buttonRefs.current[index];
    const container = containerRef.current;

    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setHighlightStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [selected, buttonList]);

  return (
    <div
      className={cn(
        "border-nl-200 dark:border-nd-500 relative flex items-center gap-x-1 rounded-lg border p-1",
        fullWidth ? "w-full" : "",
        containerClassname,
      )}
      ref={containerRef}
    >
      <span
        className="bg-pl-50 dark:bg-pd-600/50 absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-in-out"
        style={{
          left: highlightStyle.left,
          width: highlightStyle.width,
        }}
      />

      {buttonList.map((item, index) => (
        <TabButton
          key={item.value}
          isActive={selected.value === item.value}
          onClick={() => onChange(item)}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          startIcon={item.startIcon}
          endIcon={item.endIcon}
          buttonClassname={buttonClassname}
        >
          {item.label}
        </TabButton>
      ))}
    </div>
  );
};

interface TabButtonProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  startIcon?: keyof typeof LucideIcons;
  endIcon?: keyof typeof LucideIcons;
  buttonClassname?: string;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  (
    { children, isActive, onClick, startIcon, endIcon, buttonClassname },
    ref,
  ) => {
    const StartIcon = startIcon
      ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
      : null;
    const EndIcon = endIcon
      ? (LucideIcons[endIcon] as LucideIcons.LucideIcon)
      : null;

    return (
      <button
        ref={ref}
        className={cn(
          "fall relative z-10 h-full w-full cursor-pointer gap-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isActive ? activeButtonClass : notActiveButtonClass,
          buttonClassname,
        )}
        onClick={onClick}
      >
        {StartIcon && <StartIcon className="h-4 w-4 shrink-0 stroke-[1.5]" />}
        {children}
        {EndIcon && <EndIcon className="h-5 w-5 shrink-0" />}
      </button>
    );
  },
);

const activeButtonClass = `text-pl-500 dark:text-pd-50`;
const notActiveButtonClass = `text-nl-400 dark:text-nd-300 bg-transparent hover:bg-nl-50 hover:dark:bg-nd-700`;

export default Tabs;
