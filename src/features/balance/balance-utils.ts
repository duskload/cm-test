import { ApiError, type ApiErrorCode } from "../../lib/api-client";

import type { Balance } from "./balance-api";

export type BalanceErrorDetails = { title: string; message: string };

export function totalAvailableUsd(items: Balance[]) {
  return items.reduce((total, item) => {
    const available = Number(item.available);
    const usdPrice = Number(item.usdPrice);
    return Number.isFinite(available) && Number.isFinite(usdPrice)
      ? total + available * usdPrice
      : total;
  }, 0);
}
const twoDecimalNumberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
const twoDecimalUsdFormat = new Intl.NumberFormat(undefined, {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
  currencyDisplay: 'narrowSymbol',
});

export function formatNumber(value: string | number) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? twoDecimalNumberFormat.format(numericValue)
    : "—";
}
export function formatUsd(value: number) {
  return twoDecimalUsdFormat.format(value);
}
export function formatFreshness(asOf?: string) {
  if (!asOf || Number.isNaN(new Date(asOf).getTime()))
    return "Balance timing unavailable";
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(asOf).getTime()) / 1_000),
  );
  if (elapsedSeconds < 10) return "Updated just now";
  if (elapsedSeconds < 60) return `Updated ${elapsedSeconds}s ago`;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `Updated ${elapsedMinutes}m ago`;
  return `Updated ${new Date(asOf).toLocaleString()}`;
}
function retryMessage(retryAfterMs?: number) {
  if (!retryAfterMs)
    return "Too many requests were sent. Please wait a moment, then retry.";
  return `Too many requests were sent. Please retry in about ${Math.max(1, Math.ceil(retryAfterMs / 1_000))} seconds.`;
}
const errorCopy: Record<
  Exclude<ApiErrorCode, "RATE_LIMITED" | "NETWORK">,
  BalanceErrorDetails
> = {
  VALIDATION: {
    title: "Request needs attention",
    message: "The balance request was not valid. Please try again.",
  },
  UNAUTHORIZED: {
    title: "Your token needs updating",
    message: "Your API token is missing, invalid, or expired.",
  },
  NOT_FOUND: {
    title: "Balances not found",
    message: "We could not find the requested balance information.",
  },
  IDEMPOTENCY_MISMATCH: {
    title: "Request conflict",
    message:
      "This request conflicts with an earlier request. Please try again.",
  },
  SERVER: {
    title: "Service temporarily unavailable",
    message:
      "The balance service is having a temporary problem. Please retry shortly.",
  },
  TIMEOUT: {
    title: "Balance request timed out",
    message:
      "The server did not finish in time. The request outcome is unknown, so please retry.",
  },
};
export function describeBalanceError(error: unknown): BalanceErrorDetails {
  if (!(error instanceof ApiError))
    return {
      title: "Couldn’t load balances",
      message:
        "Something unexpected happened while loading your balances. Please try again.",
    };
  if (error.code === "RATE_LIMITED")
    return {
      title: "Please wait before retrying",
      message: retryMessage(error.retryAfterMs),
    };
  if (error.code === "NETWORK")
    return {
      title: "No connection to the balance service",
      message:
        "Check your internet connection, then try loading your balances again.",
    };
  return (
    errorCopy[error.code] ?? {
      title: "Couldn’t load balances",
      message:
        "Something unexpected happened while loading your balances. Please try again.",
    }
  );
}
