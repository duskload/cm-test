# Conversation prompts

## 1. App foundation

Let's create app entry, it should split on two screens right now,

- Balance screen
- Claim screen
- Activity screen

Make balance screen default one. Make other screens to show default screen names for now.

We need an api wrapper for calling an api. Let it make GET, POST, request.

Use default fetch for that.

We should handle those status codes:

| HTTP code | Meaning |
| --- | --- |
| 400 | VALIDATION — the request is invalid; `field` names the field when there is one |
| 401 | UNAUTHORIZED — token missing, invalid or expired |
| 404 | NOT_FOUND — unknown endpoint or id |
| 409 | IDEMPOTENCY_MISMATCH — an Idempotency-Key was reused with a different body |
| 429 | RATE_LIMITED — too many requests; wait `retryAfterMs` (also the Retry-After header, in seconds) |
| 500 | SERVER — temporary server error |
| 503 | SERVER — temporary server error |
| 504 | TIMEOUT — the server did not finish in time; the outcome is unknown |

API details:

- JSON in and out. Times are ISO 8601 strings in UTC.
- Amounts are decimal strings in the asset's own unit, for example `"0.0005"` (BTC). They are never JSON numbers. Each asset allows at most `decimals` decimal places. Write them as digits with an optional dot and more digits, and no leading zeros: `"0.5"` and `"12"` are fine; `".5"`, `"1."`, `"05"` and `"1e-3"` are not.
- CORS is open to any origin, so you can call the API from a web app.

Create entry for `GET /v1/balances` for now.

It should support the following statuses:

- `available`: can be claimed now
- `pending`: payback accrued but not yet confirmed; it becomes available once confirmed
- `claiming`: the amount in claims that have not completed yet
- `usdPrice`: the price of one unit in USD

Balances are snapshots, recomputed every 15 seconds. `asOf` is the time of the snapshot, so a claim you just created may not show up until the next one.

Payload example:

```json
{
  "asOf": "2026-10-20T08:01:15.000Z",
  "items": [
    {
      "asset": "USDT",
      "decimals": 6,
      "available": "820.413207",
      "pending": "50.12",
      "claiming": "0",
      "usdPrice": "1.0002"
    }
  ]
}
```

First time we launch an app we should ask user for API Token. Default TextInput will do (simple form - text input and submit).

When you submit input it should be saved in app state, let's use zustand for that, also let's persist it for further work, as it is required for api.

API contract:

- Base URL: `https://task-api.cashmine.io`
- Send your token from the task email on every `/v1` request.

## 2. Architecture

Let's follow feature-based architecture, EACH screen is a separated feature, I expect balance to have its own feature folder and all helper functions / components must belong to that feature. Write it to AGENTS.md.

## 3. Balance UI plan

Next, we will plan BALANCES screen UI.

We need to show the total of our balances, it must be distinctive. We also should show indication of how fresh our data is.

We also should show all our assets below that.

There should be loading state we can use skeleton loader (we can pick the package for that - the one that would work on web).

We should show Error and Retry UI.

Error UI should show DISTINCTIVE and clear error if we know the reason. We should show general error text if that's something unhandled.

Retry UI should show default clear text that user will understand that retry attempt can be performed.

Good. Let's make it responsive for displaying on mobile devices.

I want to hear from you at least two approaches to handle balance-after-claim decision. Context: we are the crypto currency app and we expect that user have clear understanding what had happened to their assets and, if it goes good, user should know it. If it goes badly, we should indicate so to user in easy to understand non technical language.

Good, I like first approach, let's create DEVELOPMENT_PLAN.md where you put that approach so we can work on it when we finish with balance.

Add note to AGENTS.md to follow that.

Let's name it M1 while M0 is current balances implementation.

Additions to balances:

- We should format numbers with Intl.NumberFormat, we MUST not rely on pure JS formatting.
- We should keep two decimal values for totals.
- We should keep two decimal values for assets.
- We should display clear delimiters, for example: `100.00`, `1,000.23`, `73,424.83`.
- Let's keep design system separated: create `colors.ts` and keep colors separately with clear and meaningful names, for example primary, secondary, and tertiary colors, with role-based names.

Don't show pending and claiming words until we do the actual claiming.

After current work:

- Make an exception for BTC: show 5 decimals for it.
- Do not use inline components for FlatList in balance-screen.
- Use getItemLayout because we have predictable sizes.

You should be navigated to claim screen after you click on asset on balance screen.

formatNumber helper should use Intl.NumberFormat as well.

Yes, my mistake, use it.

Make it a rule in AGENTS.md to use it for any numbers for assets.

Assets available numbers in make claim should follow the same numbers pattern (decimals etc as it does follow in the rest of the project). Write it down to AGENTS.md.

## 4. Claims

Let's start working on claims.

First, we should be able to select balance and pick its amount. Let's use claim screen for that. Let's make it presentation: modal and slide from a bottom.

Dialog should show the TextInput where you type asset amount, you can select max or any other amount.

You must see the fee and amount of asset that they receive.

User must be able to confirm and submit. After that we should complete the claim until it completes or fails.

We should use approach that we have submitted to development plan.

This all should be handled inside claim feature folder.

Let's use another api for that that we should introduce:

- POST request
- The fee is taken from the claimed amount: the user receives amount minus fee.
- Endpoint URI: `/v1/claims`
- We must use idempotency key for that to make sure that if few claims are called at once only one is being processed.
- Let's use UUID package for that and use uid of 60 characters long.
- Place idempotency key in headers with `Idempotency-Key` key.

Use the following body:

```json
{ "asset": "ETH", "amount": "0.5", "destinationId": "dest_wallet" }
```

Response should have the following payload:

```json
{
  "asset": "ETH",
  "minAmount": "0.01",
  "fee": "0.0012",
  "destinations": [{ "id": "dest_wallet", "label": "Wallet 0x8f3e…a91c" }]
}
```

For both let's use separated api for that `GET /v1/claims/${id}`.

Clarification rules for claiming:

- `minAmount <= amount <= available`, and at most `decimals` decimal places. `available` is checked live, not against the last snapshot.
- `201` returns a claim. Its amount leaves `available` at once and is counted in `claiming` until the claim settles.
- Repeating a request with the same Idempotency-Key and the same body returns the original claim (`200`, header `Idempotent-Replayed: true`) and never creates a second claim, even if the first response was lost. The same key with a different body returns `409`.

No, I don't like how we claim assets right now, let's make claiming instead of modal bottom sheet a modal. User should be able to claim it there.

But it should be possible to make the same claim from Claims screen - using the same claim modal.

If there's some helper which we use in both features, let's extract it in common helpers.

Let's use modal in portal for that.

If you click on claiming from the BALANCES screen you must not be routed to claims screen. Claiming must be performed in modal.

Same claiming in same modal should be possible from claiming screen.

We should clearly display if some asset is in the process of claiming or is not available.

Lets write dialog root for that. Use should be able to open any modal from anywhere in app.

Let's display backend error if present, for example:

```json
{
  "error": {
    "code": "VALIDATION",
    "message": "The minimum claim is 10 USDT",
    "field": "amount"
  }
}
```

## 5. Activity

Let's implement activity screen.

We should be able to make an api request and display the history of accruals, reversals and claims.

We should support pagination, use pagination library like react-paginate for it.

API endpoint: `/v1/activity?limit=20&cursor=`.

Default limit is 20 but we should be able to change it from pagination with 10, 20, 50, and 100 options.

Each history item should display:

- type
- exchange: where the payback came from; null for claims
- amount: signed; negative for reversals and claims
- status: accrual pending | confirmed; reversal confirmed; claim pending | completed | failed

We must use cursor based pagination.

Payload example:

```json
{
  "items": [
    {
      "id": "act_...",
      "type": "accrual",
      "asset": "USDT",
      "amount": "9.81",
      "status": "confirmed",
      "exchange": "Binance",
      "createdAt": "...",
      "relatedId": null
    }
  ],
  "nextCursor": "..."
}
```

Let's style pagination at the bottom properly.

Right now display per page looks weird, place it closer to the bottom pagination (above it).

Let's use separated component for activity list components.

Let's separate renderItem function and memoize it.

Let's use getItemLayout because we know items sizes before head.

In case of error you should still see pagination and be able to change it.

Let's remove 50 and 100 options from pagination and show 5 and 15 instead: 5, 10, 15, 20.

## 6. Conversation log

Let's save all my prompts to you from the start of this conversation, create folder `ai-logs/` and place it into `Prompts.md` file in it.

## 7. Cloudflare Pages deployment

I use `npx wrangler pages deploy dist --project-name=cm-test`.

How to fix it?
