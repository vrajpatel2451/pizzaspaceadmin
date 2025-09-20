import { useImageZoomStore } from "@/hooks/useImageZoomStore";
import ReactDOM from "react-dom";

const ImageZoomDialog = () => {
  const { zoomedImageSrc, onRemove } = useImageZoomStore();

  if (!zoomedImageSrc) return null;

  return ReactDOM.createPortal(
    <div
      onClick={() => onRemove()}
      className="fall bg-nl-100/95 dark:bg-nd-900/95 fixed inset-0 z-[10000] cursor-zoom-out"
    >
      <img
        src={zoomedImageSrc || ""}
        alt={`zoomed-image`}
        className="max-h-[90dvh] max-w-[90dvw] cursor-auto rounded"
        onClick={(e) => e.stopPropagation()}
        crossOrigin="anonymous"
      />
    </div>,
    document.body,
  );
};

export default ImageZoomDialog;
