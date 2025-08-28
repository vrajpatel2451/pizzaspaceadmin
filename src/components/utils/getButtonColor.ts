import type { ButtonProps, ButtonVariant } from "../base/Button";

type ButtonColor = NonNullable<ButtonProps["color"]>;
type ButtonVariantType = NonNullable<ButtonVariant>;

export function getColorClasses(
  variant: ButtonVariant = "filled",
  color: ButtonProps["color"] = "primary",
): string {
  const themes: Record<ButtonColor, Record<ButtonVariantType, string>> = {
    primary: {
      filled:
        "bg-pl-500 hover:bg-pl-600 active:bg-pl-500 text-white dark:bg-pd-500 dark:hover:bg-pd-600 dark:active:bg-pd-500",
      outline:
        "border border-pl-500 text-pl-600 hover:bg-pl-50 dark:border-pd-400 dark:text-pd-400 dark:hover:bg-pd-800",
      ghost: "text-pl-600 hover:bg-pl-50 dark:text-pd-300 dark:hover:bg-pd-800",
      link: "text-pl-600 hover:underline dark:text-pd-300",
    },
    neutral: {
      filled:
        "bg-nl-100 hover:bg-nl-200 active:bg-nl-100 text-nl-700 dark:text-nd-50 dark:bg-nd-600 dark:hover:bg-nd-700 dark:active:bg-nd-600",
      outline:
        "border border-nl-700 text-nl-700 hover:bg-nl-50 active:bg-nl-100 dark:border-nd-300 dark:text-nd-300 dark:hover:bg-nd-700 dark:active:bg-nd-600",
      ghost:
        "text-nl-700 hover:bg-nl-50 active:bg-nl-100 dark:text-nd-200 dark:hover:bg-nd-700 dark:active:bg-nd-600",
      link: "text-nl-700 hover:underline dark:text-nd-200",
    },
    success: {
      filled:
        "bg-sl-500 hover:bg-sl-600 active:bg-sl-500 text-white dark:bg-sd-500 dark:hover:bg-sd-600 active:dark:bg-sd-500",
      outline:
        "border border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 dark:border-sd-500 dark:text-ds-500 dark:hover:bg-green-900/20 dark:active:bg-green-900/40",
      ghost:
        "text-sl-600 hover:bg-green-100/60 active:bg-green-100 dark:text-sd-400 dark:hover:bg-green-900/20 dark:active:bg-green-900/40",
      link: "text-green-600 hover:underline dark:text-green-400",
    },
    danger: {
      filled:
        "bg-dl-500 hover:bg-dl-600 active:bg-dl-500 text-white dark:bg-dd-500 dark:hover:bg-dd-600 active:dark:bg-dd-600",
      outline:
        "border border-dl-500 text-dl-500 hover:bg-red-50 active:bg-red-100 dark:border-dd-500 dark:text-dd-400 dark:hover:bg-red-900/20 dark:active:bg-red-900/40",
      ghost:
        "text-dl-500 hover:bg-red-50 active:bg-red-100 dark:text-dd-400 dark:hover:bg-red-900/30 dark:active:bg-red-900/60",
      link: "text-dl-500 hover:underline dark:text-dd-400",
    },
  };

  return themes[color]?.[variant] ?? "";
}
