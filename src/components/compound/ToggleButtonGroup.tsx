import { cn } from "@/utils/helpers";
import React, { useEffect, useRef, useState, type ReactNode } from "react";

export interface ToggleButtonListItem {
  label: string;
  value: string;
}

interface ToggleButtonGroupProps {
  buttonList: ToggleButtonListItem[];
  selected: ToggleButtonListItem;
  onChange: (value: ToggleButtonListItem) => void;
  fullWidth?: boolean;
  containerClassname?: string;
  buttonClassname?: string;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = (props) => {
  const {
    buttonList,
    selected,
    onChange,
    buttonClassname,
    containerClassname,
    fullWidth,
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
        "bg-nl-50 dark:bg-nd-700 relative flex items-center gap-x-1 rounded-xl p-1",
        fullWidth ? "w-full" : "",
        containerClassname,
      )}
      ref={containerRef}
    >
      <span
        className="bg-pl-100/50 dark:bg-pd-600/50 absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-in-out"
        style={{
          left: highlightStyle.left,
          width: highlightStyle.width,
        }}
      />

      {buttonList.map((item, index) => (
        <ToggleButton
          key={item.value}
          isActive={selected.value === item.value}
          onClick={() => onChange(item)}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          buttonClassname={buttonClassname}
          fullWidth={fullWidth}
        >
          {item.label}
        </ToggleButton>
      ))}
    </div>
  );
};

interface ToggleButtonProps {
  children: ReactNode;
  isActive: boolean;
  fullWidth?: boolean;
  onClick: () => void;
  buttonClassname?: string;
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ children, isActive, onClick, buttonClassname, fullWidth }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative z-10 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
          isActive ? activeButtonClass : notActiveButtonClass,
          buttonClassname,
          fullWidth && "w-full",
        )}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

const activeButtonClass = `text-pl-500 dark:text-pd-50`;
const notActiveButtonClass = `text-nl-600 dark:text-nd-300 bg-transparent hover:bg-nl-100 hover:dark:bg-nd-600`;

export default ToggleButtonGroup;
