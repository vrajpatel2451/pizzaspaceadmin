import { useToggle } from "@/hooks/useToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useCanGoBack, useMatches, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { forwardRef } from "react";
import { IconButton } from "../base/IconButton";
import { Popover } from "../compound/Popover";
import LogoutDialog from "./LogoutDialog";
import NotificationPopover from "./NotificationPopover";
import ProfilePopover from "./ProfilePopover";

const Header = () => {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const title = currentMatch?.staticData?.pageTitle || "Page Not Found";
  const hideBackButton = currentMatch?.staticData?.hideBackButton || false;
  const { close, isOpen, open } = useToggle();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <div className="dark:bg-nd-800 border-b-nl-100 dark:border-b-nd-600 flex w-full items-center justify-between border-b bg-white px-4 py-4 sm:px-6 md:px-10">
      <div className="flex items-center gap-x-3">
        {!hideBackButton && canGoBack && (
          <IconButton
            icon={ArrowLeft}
            size={"sm"}
            className="dark:bg-nd-800 bg-white"
            iconClassName="text-nl-400 dark:text-nd-300"
            strokeWidth={2}
            onClick={() => router.history.back()}
          />
        )}
        <h4 className="text-pl-800 dark:text-pd-50 text-left font-semibold">
          {title}
        </h4>
      </div>

      <div className="flex items-center gap-x-2">
        <Popover
          trigger={
            <IconButton
              icon={Bell}
              size={"sm"}
              iconClassName="size-4 m-0.5 shrink-0 text-nl-500 dark:text-nd-100 stroke-2"
            />
          }
        >
          <NotificationPopover />
        </Popover>
        <Popover trigger={<ProfileButton />}>
          <ProfilePopover onLogoutClick={open} />
        </Popover>
      </div>
      <LogoutDialog isOpen={isOpen} close={close} />
    </div>
  );
};

const ProfileButton = forwardRef<HTMLButtonElement>((props, ref) => {
  const user = useAuthStore((s) => s?.user);

  return (
    <button
      ref={ref}
      {...props}
      className="bg-nl-100/60 hover:bg-nl-100 active:bg-nl-200 dark:bg-nd-600 dark:hover:bg-nd-500 dark:active:bg-nd-500 fall size-7 shrink-0 cursor-pointer rounded-lg"
    >
      <p className="text-nl-500 dark:text-nd-100 font-medium">
        {" "}
        {user?.name?.[0]}{" "}
      </p>
    </button>
  );
});

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    pageTitle?: string;
    hideBackButton?: boolean;
  }
}

export default Header;
