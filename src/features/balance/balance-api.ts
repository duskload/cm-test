import { ApiError, get } from "../../lib/api-client";

export { ApiError };

export type Balance = {
  asset: string;
  decimals: number;
  available: string;
  pending: string;
  claiming: string;
  usdPrice: string;
};
export type BalanceSnapshot = { asOf: string; items: Balance[] };

export const getBalances = () => get<BalanceSnapshot>("/v1/balances");
