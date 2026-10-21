# Development plan

## M0 — Balances

Current milestone: a responsive balances screen with an available USD total, freshness indicator, asset rows, loading skeleton, and clear error/retry states.

## M1 — Claim confirmation

Use the immediate confirmation approach after a user submits a claim.

1. Keep the user on the Claim screen and show an explicit claim status card.
2. On a successful submission, say the claim is processing and explain that the balance snapshot may take about 15 seconds to update.
3. While confirmation is pending, explain that the amount is processing and surface it as `claiming` on the Balance screen.
4. If the API confirms failure, use plain language: the claim was not completed and the funds remain available to claim.
5. On an unknown outcome such as a timeout, say that the app is checking the claim and instruct the user not to submit it again. Do not represent it as success or failure.
6. Preserve the claim result in Activity when that feature is implemented, so the user can revisit what happened.
