import { cn } from "@/utils/helpers";
import ImageComponent from "./ImageComponent";

interface AvatarProps {
  image?: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  classname?: string;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { fallback, image, classname, size = "md" } = props;

  return (
    <div
      className={cn(
        "fall bg-nd-200 shrink-0 overflow-hidden rounded-full",
        sizeMap[size],
        classname,
      )}
    >
      {image ? (
        <ImageComponent src={image} alt={fallback} />
      ) : (
        <h6 className="font-medium">{fallback}</h6>
      )}
    </div>
  );
};

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
};

export default Avatar;
