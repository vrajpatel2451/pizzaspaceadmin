import { imageZoomActions, useAppDispatch, useAppSelector } from "@/store";
import { useCallback } from "react";

export const useImageZoomStore = () => {
  const imageZoomState = useAppSelector((state) => state.imageZoom);
  const dispatch = useAppDispatch();
  const { zoomedImageSrc } = imageZoomState;

  const onRemove = useCallback(() => {
    dispatch(imageZoomActions.removeImage());
  }, []);
  const onSetImage = useCallback((url: string) => {
    dispatch(imageZoomActions.setZoomImage(url));
  }, []);

  return { zoomedImageSrc, onSetImage, onRemove };
};
