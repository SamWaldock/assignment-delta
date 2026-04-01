# Prompts

## Initial Project Creation Prompt

1. Created the following prompt template for my LLM model Claude Sonnet 4.6. I adjusted my greenfield prompt template for this project, given that the backend already exists. This was the final template chosen to use:
   - **Project Overview** — General description of the project
   - **Tech Stack** — Language, framework, libraries, testing, …
   - **Core Features** — All the features the application will consist of
   - **API** — A list of all the endpoints and models/types available
   - **Constraints & Non-Negotiables** — Project rules that should surely be followed
   - **What to Avoid** — Anti-patterns, tech/libraries to avoid, things out of scope
   - **Desired Outcome** — The desired result that is shippable to a user

2. Next I let Claude generate the project creation prompt using the entire context of the project and the template I gave it.

3. It created a detailed written-out prompt using the template I gave it. Next to that it also suggested some extra points to write out, e.g.:
   - State Management Rules
   - Performance Requirements
   - Testing
   - Documentation Files to Generate

   I liked these, so I kept them. Those were key points described in this assignment, so it made sense to dedicate separate sections for them.

4. Finally, I went through the entire prompt and changed/improved the following:
   - Added a key points to the documentation section:
     - The fact that an `AGENTS.md` file and its sub-files should be generated
     - This is important to keep all requirements and structure documented
     - Also ensures future requirement changes/extensions are tracked
     - Helps the agent take all requirements into account when implementing new features

   - Replaced `FlatList` with `LegendList`
     - Avoids blank-cell flicker during fast scrolling
     - Keeps items mounted
     - Handles variable-height rows without manual measurement
     - Results in smoother scrolling for large lists

   - Changed loading indicator to skeleton view
     - Improves perceived performance
     - Gives a sense of continuous flow instead of waiting

   - Expanded testing:
     - Added extra unit tests
     - Extended Maestro E2E flow
     - Focused E2E on verifying data availability
     - Kept unit tests simple due to limited business logic

   - Added missing tooling:
     - Linting and formatting (ESLint + Prettier)
     - Husky pre-commit hooks to enforce checks

   - Minor requirement improvements

   - Refactored folder structure:
     - Original: type-based (`src/components`, `src/hooks`, …)
     - Updated to: **feature-based structure**
     - Benefits:
       - More scalable
       - Easier onboarding for new developers

5. Before running the prompt, I let Claude review it again.
   - It suggested being more specific about certain third-party libraries (e.g. LegendList), which I applied.

--- Initial Project Creation Prompt ---

# Coins App

## Project Overview

A React Native (Expo) mobile app that loads and displays a list of cryptocurrency coins from the Delta API. The app supports list browsing, detail viewsa, pagination, offline behavior, error handling, and data freshness tracking. It must compile and run on both iOS and Android.

## Tech Stack

Language: TypeScript
Framework: React Native via Expo
Navigation: Expo Router
Client state: Zustand
Server state / caching: TanStack Query
Styling: NativeWind
Unit testing: Jest + React Native Testing Library
E2E testing: Maestro
Linting & formatting: ESLint (`eslint-config-expo`) + Prettier, enforced via Husky pre-commit hook
Icons: expo-symbols or @expo/vector-icons
Lists: LegendList (@legendapp/list)

## Core Features

### Screen 1 — Coin List

- Fetch coins from the Delta API on mount.
- Display coins in a performant, scrollable `Legend List`.
- Implement infinite scroll / pagination using `page[number]` and `page[size]` query params.
- Each list item must show:
    - Coin icon (from the icon endpoint, use the coin `id`)
    - Coin name and symbol
    - At least one numeric field (e.g. current price or market cap)
- While loading, show a skeleton.
- On error, show an error state with a retry button.
- When offline, show a meaningful message and display cached data if available.

### Screen 2 — Coin Detail

- Tapping a list item navigates to a detail screen (pass `id` via route params).
- Fetch additional data for the coin from `GET /web/coins/:id`.
- Display multiple fields from the response (name, symbol, price, market cap, volume, etc.).
- Provide a pull down view to refresh the detail page.
- Show when the data was last updated using **local state** (timestamp set when the fetch completes, not a value from the API).
- Show loading and error states; allow retry on failure.

### Offline & Error Behavior

- Use TanStack Query's `staleTime` and `gcTime` (cacheTime) to control cache lifetime.
    - List data: stale after 60 seconds, keep in cache for 5 minutes.
    - Detail data: stale after 30 seconds, keep in cache for 5 minutes.
- When a request fails or the device is offline:
    - Serve stale cached data if available, with a visible "stale data" banner.
    - If no cache exists, show a clear error message and a retry button.
- Use `@react-native-community/netinfo` (or equivalent) to detect offline state.

## API

### Endpoints

- Coins list (default): `https://api.getdelta.io/web/coins`
- Coins list (paginated): `https://api.getdelta.io/web/coins?page[number]=1&page[size]=50`
- Coin detail: `https://api.getdelta.io/web/coins/:id`
- Coin icon: `https://delta.app/images/:id/icon-64.png`

### Types

CoinsListResponse (Coins list)
  meta: CoinsMeta
    success:        boolean
    totalCoinCount: number
  data: Coin[]

CoinDetailResponse (Coin detail)
  meta: Pick<CoinsMeta, 'success'>
  data: Coin

Coin
  id:               string   ← used in icon URL
  code:             string   ← lowercase ticker  (e.g. "btc")
  dirtyCode:        string   ← original-case     (e.g. "BTC")
  name:             string
  slug:             string
  priceInUSD:       number
  availableSupply:  number
  totalSupply:      number
  marketCapRank:    number
  volume24hInUSD:   number
  marketCapInUSD:   number
  percentChange1h:  number
  percentChange24h: number
  percentChange7d:  number
  showDisclaimer:   boolean  ← flag for unreliable/low-liquidity coins

Helper (Coin icon)
  getCoinIconUrl(id) → `https://delta.app/images/${id}/icon-64.png`

## State Management Rules

- **TanStack Query** owns all server state: fetching, caching, loading/error status, background refetching.
- **Zustand** owns local UI state only: e.g. last-updated timestamps for the detail screen, any app-level flags.
- Do NOT duplicate server state into Zustand. Keep the two concerns clearly separated.

## Performance Requirements

- Use React Compiler to automatically memoize components, eliminating the need for manual useMemo / useCallback in most cases. Verify compatibility with the installed Expo SDK version before enabling — if the compiler is incompatible or causes issues, fall back to manual useMemo / useCallback where needed.
- Lazy-load coin icons (use `expo-image` for caching and performance).
- Paginate the list — do not load all coins at once. Use `useInfiniteQuery`.

## Testing

### Unit / Integration (Jest + RNTL)

Write tests for the highest-value areas:

- `CoinListItem` renders name, symbol, and numeric field correctly.
- `ErrorState` renders error message and calls `onRetry` when button is pressed.
- `useCoin` hook returns correct loading/error/data states (mock fetch).
- `useCoinStore` Zustand store updates the last-updated timestamp correctly.

Do NOT write tests for:

- Navigation wiring (covered by E2E)
- Third-party library internals

### E2E (Maestro)

Write at least one flow:

- Launch app → start scrolling once list loaded → scroll for a few times → tap random coin → detail screen appears with coin name visible and other data available → refresh detail screen by pulling down → check whether data still available.

## Documentation Files to Generate

1. **README.md**
      - Prerequisites (Node, Expo CLI, simulators)
      - `npm install` / `npx expo start` instructions
      - How to run tests (`jest`, `maestro test`)
      - Project structure

2. **AGENTS.md** _(root level — entry point for all AI agents)_
      - High-level overview of the project for agents
      - Tech stack summary and folder conventions
      - Coding rules: TypeScript strict mode, functional components only, state management boundaries
      - Reference the `docs/` folder for deeper per-topic sub-instructions
      - Include patterns and anti-patterns agents must follow in this codebase
      - Other usefull information for the agent to know regarding the project

3. **docs/** _(per-topic agent sub-instructions)_
      - `state-management.instructions.md` — TanStack Query vs Zustand boundaries, cache config, query key conventions
      - `api.instructions.md` — how to add new API calls, where types live, error handling patterns
      - `components.instructions.md` — component structure, memoization rules, NativeWind styling conventions
      - `testing.instructions.md` — what to test, what to skip, how to mock TanStack Query and Zustand in tests
      - Other sub instructions if necessary

## Folder Structure

Organize the project by **feature**, not by file type. Each feature owns its components, hooks, and types. Only genuinely shared code lives at the top level.

### Structure

```
app/                          # Expo Router entry points (screens only — no logic)
  (tabs)/
    index.tsx                 # Coin list screen
    _layout.tsx
  coin/
    [id].tsx                  # Coin detail screen
  _layout.tsx
 
src/
  features/
    coins/                    # Everything related to the coins list
      components/
        CoinListItem.tsx
        CoinListSkeleton.tsx
      hooks/
        useCoinList.ts        # useInfiniteQuery wrapper
      coins.types.ts          # Coin, CoinsListResponse, CoinsMeta
    coin-detail/              # Everything related to a single coin
      components/
        CoinDetailCard.tsx
        LastUpdatedBanner.tsx
        StaleBanner.tsx
      hooks/
        useCoin.ts            # useQuery wrapper for GET /web/coins/:id
      coin-detail.types.ts    # CoinDetailResponse (extends shared Coin type)
 
  shared/
    components/               # Reusable UI used across features
      ErrorState.tsx
      OfflineBanner.tsx
      SkeletonBlock.tsx
    hooks/
      useNetworkStatus.ts     # NetInfo wrapper
    store/
      useCoinStore.ts         # Zustand store (last-updated timestamps, UI flags)
    services/
      api.ts                  # Axios/fetch client, typed endpoints, base URL
      queryKeys.ts            # Centralized TanStack Query key factory
    utils/
      getCoinIconUrl.ts       # getCoinIconUrl(id) helper
    types/
      api.types.ts            # Shared API envelope types
 
  constants/
    config.ts                 # Base URLs, staleTime/gcTime values, page size
 
docs/
  state-management.instructions.md
  api.instructions.md
  components.instructions.md
  testing.instructions.md
 
__tests__/                    # Mirrors src/ structure
  features/
    coins/
      CoinListItem.test.tsx
    coin-detail/
      useCoin.test.ts
  shared/
    components/
      ErrorState.test.tsx
    store/
      useCoinStore.test.ts
 
.maestro/
  coin-list-to-detail.yaml
 
…
```

### Key Rules

- **Screens (`app/`) are thin.** They import from `src/features/` and render — no inline business logic, no direct API calls.
- **Feature folders are self-contained.** `coins/` and `coin-detail/` do not import from each other. If something is needed by both, move it to `shared/`.
- **`shared/` requires two consumers to justify entry.** Do not pre-emptively move things there — only promote when a second feature actually needs it.
- **Query keys live in one place.** `shared/services/queryKeys.ts` is the single source of truth — no inline string keys anywhere.
- **Types follow their feature.** `coins.types.ts` lives inside `features/coins/`. Only the base `Coin` type (used by both features) is defined in `shared/types/api.types.ts` and imported by both.
- **Constants and config are not features.** Stale times, base URLs, and page sizes live in `constants/config.ts` and are imported wherever needed.

## Constraints & Non-Negotiables

- TypeScript strict mode — no `any`, no `@ts-ignore` unless commented with a reason.
  All code must pass ESLint and Prettier checks — warnings are treated as errors. Do not disable rules inline without a comment explaining why.
- Must compile and run on both iOS and Android without platform-specific hacks.
- All API calls must be typed end-to-end (define response interfaces in `services/api.ts`).
- No class components — functional components + hooks only.
- Make a small but clear separation between concerns
- Focus on clean, simple UI/UX design. Prioritize usability and clarity while maintaining a visually appealing interface, but avoid unnecessary complexity or overdesign.
- Ensure the app is fully compatible with Expo Go and can run smoothly within its environment.
- Use the latest stable versions of all dependencies, ensuring they are fully compatible with one another.

## What to Avoid

- Do not fetch all coins in a single request — paginate.
- Do not store API response data in Zustand — that's TanStack Query's responsibility.
- Do not use `useEffect` to trigger fetches — let TanStack Query handle it.
- Do not use `any` types.
- Do not add unnecessary abstractions or over-engineer for hypothetical scale.
- Do not create a full design system — plain NativeWind utility classes are sufficient.
- Do not wrap every component in a custom HOC or context unless clearly necessary.

## Desired Outcome

- App launches on iOS simulator and Android emulator without errors.
- Coin list loads, paginates on scroll, and shows icon + name + symbol + one numeric field.
- Tapping a coin navigates to the detail screen with full coin data.
- Detail screen shows a last-updated timestamp that updates on refresh.
- Pull down view to refresh on detail screen re-fetches data.
- Offline and error states are handled gracefully on both screens.
- Stale cached data is shown when offline, with a visible indicator.
- Unit tests pass.
- ESLint passes with zero warnings and Prettier reports no diffs on all source files.
- At least one Maestro E2E flow exists and is documented.
- End-to-end tests pass.

--- End Initial Project Creation Prompt ---

## Review project setup

1. After running the initial prompt, the results clearly showed the value of providing strong context upfront. The project structure and output were already solid.

2. During review, I identified the following improvements:
   - Missing tests:
     - Added UI tests
     - Added hook tests
     - Achieved more complete coverage

   - Code style:
     - Replaced normal functions with arrow functions

   - Refactoring:
     - Extracted shared utility:
       - `formatPrice` function
       - Removed duplication across features

   - Improved agent instructions:
     - Intrstructed if a test should be written by criteria instead of exact lists of files
     - Updated some minor details in the instructions

   - Maestro:
     - It seems Claude is not great yet creating Maestro flows
     - I reviewed the flow and made some command changes

   - In addition to these points I couldn't find anything else to disagree with
