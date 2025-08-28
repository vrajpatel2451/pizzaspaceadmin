import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

export type BreadcrumbItem = {
  label: string;
  to: string;
};

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const { breadcrumbs } = props;

  return (
    <ol className={`flex h-6 space-x-1`}>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon
                className="text-nl-400 dark:text-nd-300 mr-0.5"
                size={14}
              />
            )}
            <Link
              to={breadcrumb.to}
              className={`truncate text-sm transition-colors ${breadcrumbs.length === index + 1 ? "text-nl-700 dark:text-nd-100 font-medium" : "text-nl-400 hover:text-nl-600 dark:text-nd-300 hover:dark:text-nd-200"}`}
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
