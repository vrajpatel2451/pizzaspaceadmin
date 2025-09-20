import { cn } from "@/utils/helpers";
import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

interface UploadImagePlaceholderProps {
  onClick: () => void;
  customIcon?: ReactNode;
  classname?: string;
}

const UploadImagePlaceholder: React.FC<UploadImagePlaceholderProps> = (
  props,
) => {
  const { onClick, classname, customIcon } = props;

  return (
    <div
      onClick={onClick}
      className={cn(
        "border-nl-200 dark:border-nd-500 hover:bg-nl-50/50 dark:hover:bg-nd-600 flex h-32 w-full flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed transition-all",
        classname,
      )}
    >
      {customIcon ? (
        customIcon
      ) : (
        <ImageIcon className="text-nl-500 dark:text-nd-400" />
      )}
      <p className="text-nl-600 dark:text-nd-300">Select Photo</p>
    </div>
  );
};

export default UploadImagePlaceholder;
