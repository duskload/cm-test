import { get, post } from "../../lib/api-client";

export type ClaimableBalance = {
  asset: string;
  decimals: number;
  available: string;
  claiming: string;
};

type BalancesResponse = {
  items: (ClaimableBalance & Record<string, unknown>)[];
};

export type ClaimStatus = {
  id: string;
  status: string;
  asset: string;
  amount: string;
  fee?: string;
  receivedAmount?: string;
  error?: string;
};

type CreateClaimResponse = Partial<ClaimStatus> & {
  id?: string;
  claimId?: string;
};

export const getClaimableBalances = async () =>
  (await get<BalancesResponse>("/v1/balances")).items;

export const getClaim = (id: string) =>
  get<ClaimStatus>(`/v1/claims/${encodeURIComponent(id)}`);

export async function createClaim(input: {
  asset: string;
  amount: string;
  destinationId: string;
  idempotencyKey: string;
}): Promise<ClaimStatus> {
  const response = await post<CreateClaimResponse>(
    "/v1/claims",
    {
      asset: input.asset,
      amount: input.amount,
      destinationId: input.destinationId,
    },
    { headers: { "Idempotency-Key": input.idempotencyKey } },
  );
  const id = response.id ?? response.claimId;
  if (!id)
    throw new Error("The claim was submitted but did not return a claim ID.");
  return {
    ...response,
    asset: response.asset ?? input.asset,
    amount: response.amount ?? input.amount,
    id,
    status: response.status ?? "processing",
  };
}
