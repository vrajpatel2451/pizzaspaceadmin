import { toast } from "@/components/compound/Sonner";
import type { BaseApiErrorResponse } from "@/types/baseApi.types";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showErrorToasts = (
  err: BaseApiErrorResponse | any,
  limit?: number,
) => {
  if (Array.isArray(err.message)) {
    const messages = limit ? err.message.slice(0, limit) : err.message;
    messages.forEach((msg: string) => {
      toast.error(msg);
    });
  } else {
    toast.error(err.message || err.error || "Unknown error");
  }
};

export const showValidationErrors = (
  errors: Record<string, { message?: string }>,
  limit?: number,
) => {
  const messages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);

  const limitedMessages = limit ? messages.slice(0, limit) : messages;

  limitedMessages.forEach((msg) => toast.error(msg || "Form validation error"));
};

export const objectToSearchParams = (obj?: Record<string, any>): string => {
  if (!obj) return "";
  return new URLSearchParams(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
};

export const toCommaSeparated = (values: string[]): string => {
  return values.filter(Boolean).join(", ");
};

export const getFileExtension = (file: File) => {
  if (!file) return "File not found";
  const extension = file.name.split(".").pop()?.toUpperCase();
  return extension;
};
