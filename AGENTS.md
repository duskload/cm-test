This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Feature architecture

- Keep every screen in a dedicated feature folder under `src/features/<feature-name>/`.
- Route files in `src/app/` are thin entry points only: they import and render the feature screen.
- Keep a feature's UI components, hooks, API calls, types, and helpers inside that feature folder. Do not place feature-specific code in shared folders.
- Use shared modules only for code genuinely used by multiple features (for example app-wide state or the base API client).

## Milestones and design system

- `M0` is the current balances implementation. `M1` is the post-claim confirmation flow; its agreed approach and scope live in `DEVELOPMENT_PLAN.md`.
- Keep reusable visual tokens in `src/design-system/`. Use role-based color names from `src/design-system/colors.ts`; do not introduce raw color values in feature components.
- Format every displayed asset amount and USD total with `Intl.NumberFormat`; never implement separators or decimal formatting manually. Balances and USD totals display two decimal places with locale-appropriate grouping separators, except where an asset-specific precision rule applies (for example, BTC displays five decimal places).
- Reuse the same asset-number formatter everywhere an asset amount is shown, including Claim selection, available amounts, maximums, fees, and received amounts. Claim UI must never use raw API decimal strings for display.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
