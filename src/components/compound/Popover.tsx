import React, { type ReactNode } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "@/utils/helpers";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
  disablePortal?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  heading?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  className = "",
  heading = "",
  disablePortal = false,
  isOpen = false,
  onOpenChange,
}) => {
  const controlledProps =
    typeof isOpen === "boolean" && onOpenChange
      ? { open: isOpen, onOpenChange }
      : {};

  const content = (
    <RadixPopover.Content
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={{ right: 10, left: 10 }}
      className={cn(
        "PopoverContent z-50 min-w-[10rem] rounded-lg border bg-white shadow-sm",
        "border-nl-200 dark:border-nd-500 dark:bg-nd-700",
        className,
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {heading && (
        <div className="dark:border-b-nd-500 border-b-nl-200 border-b p-2.5">
          <p className="text-nl-600 dark:text-nd-200"> {heading} </p>
        </div>
      )}
      <div className="px-1 py-1.5">{children}</div>
    </RadixPopover.Content>
  );

  return (
    <RadixPopover.Root {...controlledProps}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      {disablePortal ? (
        content
      ) : (
        <RadixPopover.Portal>{content}</RadixPopover.Portal>
      )}
    </RadixPopover.Root>
  );
};

export const PopoverClose = RadixPopover.Close;
