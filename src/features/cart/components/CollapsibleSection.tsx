import { ChevronDown } from "lucide-react";
import { type FC, type ReactNode, useState, useEffect } from "react";

type Props = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isDisabled?: boolean;
  className?: string;
};

const CollapsibleSection: FC<Props> = ({
  title,
  icon,
  children,
  defaultOpen = true,
  isDisabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const toggleOpen = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`border-b border-nl-200 dark:border-nd-700 ${className}`}>
      <button
        type="button"
        onClick={toggleOpen}
        disabled={isDisabled}
        className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
          isDisabled
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-nl-100 dark:hover:bg-nd-800"
        }`}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-nl-600 dark:text-nd-400">{icon}</span>
          )}
          <span className="text-sm font-medium text-nl-700 dark:text-nd-50">
            {title}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-nl-600 dark:text-nd-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
