import { type ReactNode } from "react";

export type HeadData = {
  label: string;
  align?: "left" | "right" | "center";
};

export type TableProps = {
  headData: HeadData[];
  body: ReactNode;
  maxHeight?: string;
  stickyHeader?: boolean;
};
