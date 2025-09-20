import { cn } from "@/utils/helpers";
import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to: string;
};

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const { breadcrumbs, className } = props;

  return (
    <ol className={`flex h-6 space-x-1`}>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon
                className={cn("text-nl-400 dark:text-nd-300 mr-0.5", className)}
                size={14}
              />
            )}
            <Link
              to={breadcrumb.to}
              className={`truncate text-sm transition-colors ${breadcrumbs.length === index + 1 ? "text-nl-700 dark:text-nd-100 font-medium" : "text-nl-400 hover:text-nl-600 dark:text-nd-300 hover:dark:text-nd-200"} ${className ?? ""}`}
            >
              {breadcrumb.label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumbs;
