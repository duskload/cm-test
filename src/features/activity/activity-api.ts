import { get } from "../../lib/api-client";

export type ActivityType = "accrual" | "reversal" | "claim";
export type ActivityItem = { id: string; type: ActivityType; asset: string; amount: string; status: string; exchange: string | null; createdAt: string; relatedId: string | null };
export type ActivityPage = { items: ActivityItem[]; nextCursor: string | null };

export function getActivity({ cursor, limit }: { cursor: string | null; limit: number }) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.set("cursor", cursor);
  return get<ActivityPage>(`/v1/activity?${query.toString()}`);
}
