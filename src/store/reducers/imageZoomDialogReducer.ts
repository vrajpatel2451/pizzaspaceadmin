import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ImageZoomState } from "../types";

export const initialStateImageZoom: ImageZoomState = {
  zoomedImageSrc: null,
};

const reducer = createSlice({
  name: "imageZoom",
  initialState: initialStateImageZoom,
  reducers: {
    removeImage: (state) => {
      state.zoomedImageSrc = null;
    },
    setZoomImage: (state, action: PayloadAction<string>) => {
      state.zoomedImageSrc = action.payload;
    },
  },
});

export const imageZoomReducer = reducer.reducer;
export const imageZoomActions = reducer.actions;
