// import { useState } from "react";
// import type { DialogProps } from "../Dialog";
// import Dialog from "../Dialog";
// import ToggleButtonGroup, {
//   type ToggleButtonListItem,
// } from "../ToggleButtonGroup";
// import FileUploader from "./FileUploader";
// import MediaGallery from "./MediaGallery";
// import { Button } from "@/components/base/Button";

// interface MediaPickerProps extends Pick<DialogProps, "isOpen" | "close"> {
//   acceptedFormats?: string[];
//   maxSizeMB?: number;
//   multiple?: boolean;
//   onError?: (error: string) => void;
//   onMediaSelect?: (urls: string | string[]) => void;
//   onUploadComplete?: (urls: string[]) => void;
// }

// const MediaPicker: React.FC<MediaPickerProps> = (props) => {
//   const [mode, setMode] = useState<ToggleButtonListItem>(toggleButtonList[0]);
//   const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

//   const {
//     close,
//     isOpen,
//     acceptedFormats,
//     maxSizeMB,
//     multiple,
//     onError,
//     onUploadComplete,
//     onMediaSelect,
//   } = props;

//   const onButtonChange = (button: ToggleButtonListItem) => {
//     setMode(button);
//     setSelectedUrls([]);
//   };

//   const handleMediaSelection = (urls: string | string[]) => {
//     const urlArray = Array.isArray(urls) ? urls : [urls];

//     if (multiple) {
//       setSelectedUrls((prev) => [...prev, ...urlArray]);
//     } else {
//       setSelectedUrls(urlArray);
//     }
//   };

//   const handleConfirmSelection = () => {
//     if (selectedUrls.length > 0) {
//       onMediaSelect?.(multiple ? selectedUrls : selectedUrls[0]);
//       onUploadComplete?.(selectedUrls);
//       setSelectedUrls([]);
//       close();
//     }
//   };

//   const handleCancel = () => {
//     setSelectedUrls([]);
//     close();
//   };

//   const isGallery = mode.value === MediaPickerModes.gallery;

//   return (
//     <Dialog
//       title="Media Picker"
//       size="xl"
//       close={handleCancel}
//       isOpen={isOpen}
//       subTitle="Select an image from your gallery or upload one from your device."
//     >
//       <ToggleButtonGroup
//         buttonList={toggleButtonList}
//         onChange={onButtonChange}
//         selected={mode}
//         fullWidth
//       />

//       <div className="mt-6">
//         {isGallery ? (
//           <MediaGallery
//             onUploadComplete={handleMediaSelection}
//             multiple={multiple}
//             selectedUrls={selectedUrls}
//           />
//         ) : (
//           <FileUploader
//             acceptedFormats={acceptedFormats}
//             maxSizeMB={maxSizeMB}
//             multiple={multiple}
//             onError={onError}
//             onUploadComplete={onUploadComplete}
//           />
//         )}
//       </div>

//       {isGallery && (
//         <div className="mt-4 flex items-center gap-3">
//           {selectedUrls.length > 0 && (
//             <p className="text-nl-700 dark:text-nd-200 text-sm">
//               {selectedUrls.length} {multiple ? "items" : "item"} selected
//             </p>
//           )}
//           <Button color="neutral" className="ml-auto" onClick={handleCancel}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmSelection}
//             disabled={selectedUrls.length === 0}
//           >
//             Select {selectedUrls.length > 0 && `(${selectedUrls.length})`}
//           </Button>
//         </div>
//       )}
//     </Dialog>
//   );
// };

// export default MediaPicker;

// enum MediaPickerModes {
//   gallery = "gallery",
//   uploader = "uploader",
// }

// const toggleButtonList: ToggleButtonListItem[] = [
//   {
//     label: "Gallery",
//     value: MediaPickerModes.gallery,
//   },
//   {
//     label: "Upload",
//     value: MediaPickerModes.uploader,
//   },
// ];
