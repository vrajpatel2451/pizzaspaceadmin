import { cn } from "@/utils/helpers";

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex min-h-full flex-col gap-6 bg-slate-50 p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScreenContainer;
