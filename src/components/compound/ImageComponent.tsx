import { useImageZoomStore } from "@/hooks/useImageZoomStore";
import { cn } from "@/utils/helpers";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import fallback from "/image-fallback.svg";

interface ImageComponentProps {
  src: string | File;
  className?: string;
  wrapperClassName?: string;
  alt: string;
  disableZoom?: boolean;
  onRemove?: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = (props) => {
  const {
    alt,
    src,
    className,
    wrapperClassName,
    disableZoom = false,
    onRemove,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { onSetImage } = useImageZoomStore();

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const shouldZoom = onRemove ? true : !disableZoom && src && !hasError;

  const getSrc = () => {
    if (typeof src === "string") {
      return src.startsWith("blob:") ? src : `${baseUrl}/${src}`;
    } else if (src instanceof File) {
      return URL.createObjectURL(src);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (shouldZoom) {
      e.stopPropagation();
      onSetImage(getSrc() || "");
    }
  };

  return (
    <div
      className={cn(
        "bg-nl-50/30 dark:bg-nd-800 relative overflow-visible",
        shouldZoom && "group",
        wrapperClassName,
      )}
    >
      <img
        src={hasError || !src ? fallback : getSrc()}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "object-cover object-center",
          isLoading ? "shimmer" : "",
          className,
        )}
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
      />

      <span
        className={cn(
          "gap-y- absolute top-0.5 right-0.5 hidden flex-col rounded-full bg-black/30 group-hover:flex",
        )}
      >
        <span
          onClick={handleImageClick}
          className={cn(
            shouldZoom && "cursor-zoom-in rounded-full p-1 hover:bg-black/35",
          )}
        >
          <Maximize2 size={12} className="text-white" />
        </span>
        {onRemove && (
          <span
            className={cn("cursor-pointer rounded-full p-1 hover:bg-black/35")}
            onClick={onRemove}
          >
            <X size={12} className="text-white" />
          </span>
        )}
      </span>
    </div>
  );
};

export default ImageComponent;

const baseUrl = import.meta.env.VITE_BACKEND_URL;
