import z from "zod";

export const selectZodSchema = <T extends string = string>(
  requireMessage?: string,
) =>
  z.object({
    label: z.string().min(1, requireMessage || "Required"),
    value: z.custom<T>((val) => typeof val === "string" && val.length > 0, {
      message: requireMessage || "Required",
    }),
  });

export const phoneSchema = z
  .string()
  .refine((val) => /^[6-9]\d{9}$/.test(val), {
    message: "Mobile number must be exactly 10 digits and start with 6-9",
  });

export const passwordSchema = z
  .string()
  .min(4, "Password must be at least 4 characters")
  .max(12, "Password must be at most 12 characters");

export const paginationSearchParams = z.object({
  currentPage: z.number().optional(),
  pageSize: z.number().optional(),
});

export const searchWithPaginationSearchParams = z.object({
  currentPage: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
});
