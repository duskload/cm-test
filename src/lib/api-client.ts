import { useAuthStore } from "../stores/auth-store";

const BASE_URL = "https://task-api.cashmine.io";

export type ApiErrorCode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "IDEMPOTENCY_MISMATCH"
  | "RATE_LIMITED"
  | "SERVER"
  | "TIMEOUT"
  | "NETWORK";

type ApiErrorPayload = {
  code?: ApiErrorCode;
  message?: string;
  field?: string;
  retryAfterMs?: number;
};

type ApiErrorResponse = ApiErrorPayload | { error?: ApiErrorPayload };

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status?: number,
    public readonly field?: string,
    public readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type RequestOptions = Omit<
  RequestInit,
  "body" | "headers" | "method"
> & {
  body?: unknown;
  headers?: HeadersInit;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

const parseErrorPayload = (value: unknown): ApiErrorPayload => {
  if (!value || typeof value !== "object") return {};
  const response = value as ApiErrorResponse;
  return "error" in response && response.error
    ? response.error
    : (response as ApiErrorPayload);
};

function messageFor(status: number, payload: ApiErrorPayload) {
  if (payload.message) return payload.message;
  const suffix = payload.field ? `: ${payload.field}` : "";
  switch (status) {
    case 400:
      return `The request is invalid${suffix}.`;
    case 401:
      return "Your API token is missing, invalid, or expired.";
    case 404:
      return "The requested endpoint or item could not be found.";
    case 409:
      return "This idempotency key was already used with a different request body.";
    case 429:
      return "Too many requests. Please wait before trying again.";
    case 500:
    case 503:
      return "The server is temporarily unavailable. Please try again.";
    case 504:
      return "The request timed out. Its outcome is unknown.";
    default:
      return "The request could not be completed.";
  }
}
function codeFor(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return "VALIDATION";
    case 401:
      return "UNAUTHORIZED";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "IDEMPOTENCY_MISMATCH";
    case 429:
      return "RATE_LIMITED";
    case 500:
    case 503:
      return "SERVER";
    case 504:
      return "TIMEOUT";
    default:
      return "NETWORK";
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = useAuthStore.getState().apiToken;
  const { body, headers, method = "GET", ...init } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined)
    requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: requestHeaders,
      method,
    });
  } catch {
    throw new ApiError(
      "Unable to connect to the API. Check your connection and try again.",
      "NETWORK",
    );
  }
  if (!response.ok) {
    let payload: ApiErrorPayload = {};
    try {
      payload = parseErrorPayload(await response.json());
    } catch {
      /* JSON error body is optional. */
    }
    const retryAfterSeconds = Number(response.headers.get("Retry-After"));
    const retryAfterMs =
      payload.retryAfterMs ??
      (Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds * 1_000
        : undefined);
    throw new ApiError(
      messageFor(response.status, payload),
      payload.code ?? codeFor(response.status),
      response.status,
      payload.field,
      retryAfterMs,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const get = <T>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">,
) => request<T>(path, { ...options, method: "GET" });

export const post = <T>(
  path: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">,
) => request<T>(path, { ...options, body, method: "POST" });
