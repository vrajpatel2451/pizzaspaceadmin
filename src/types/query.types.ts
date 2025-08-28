import type { QueryOptions } from "@tanstack/react-query";

export type QueryType = Record<
  string,
  (
    ...args: any[]
  ) => QueryOptions<unknown, unknown, unknown, readonly unknown[]>
>;
