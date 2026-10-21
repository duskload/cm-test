export const PAGE_LIMITS = [5, 10, 15, 20] as const;
export type PageLimit = (typeof PAGE_LIMITS)[number];
