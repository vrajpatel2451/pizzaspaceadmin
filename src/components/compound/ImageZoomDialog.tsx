// import { useImageZoomStore } from "@/store/useImageZoomStore";
// import ReactDOM from "react-dom";

// const ImageZoomDialog = () => {
//   const { zoomedImageSrc, setZoomedImageSrc } = useImageZoomStore();

//   if (!zoomedImageSrc) return null;

//   return ReactDOM.createPortal(
//     <div
//       onClick={() => setZoomedImageSrc(null)}
//       className="fall bg-nl-100/95 dark:bg-nd-900/95 fixed inset-0 z-[10000] cursor-zoom-out"
//     >
//       <img
//         src={zoomedImageSrc || ""}
//         alt={`zoomed-image`}
//         className="max-h-[90dvh] max-w-[90dvw] cursor-auto rounded"
//         onClick={(e) => e.stopPropagation()}
//       />
//     </div>,
//     document.body,
//   );
// };

// export default ImageZoomDialog;
