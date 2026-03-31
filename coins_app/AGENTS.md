# AGENTS.md — AI Agent Instructions

## Project Overview

This is a React Native (Expo SDK 54) cryptocurrency app that displays coin data from the Delta API. It uses TypeScript strict mode, Expo Router for navigation, TanStack Query for server state, Zustand for client state, and NativeWind for styling.

## Tech Stack

| Layer        | Technology                  |
| ------------ | --------------------------- |
| Runtime      | React Native 0.81 / Expo 54 |
| Language     | TypeScript (strict)         |
| Navigation   | Expo Router                 |
| Server State | TanStack Query v5           |
| Client State | Zustand                     |
| Styling      | NativeWind (Tailwind CSS)   |
| Lists        | LegendList                  |
| Images       | expo-image                  |
| Testing      | Jest + RNTL + Maestro       |
| Linting      | ESLint + Prettier           |

## Folder Conventions

```
app/           → Expo Router screens. THIN — import from src/, render, done.
src/features/  → Feature modules (coins/, coin-detail/).
src/shared/    → Code used by 2+ features. Need 2 consumers to justify entry.
src/constants/ → Config values (URLs, cache times, page size).
__tests__/     → Mirrors src/ structure unless there is no logic involved.
.maestro/      → E2E test flows.
docs/          → Per-topic agent sub-instructions.
```

## Coding Rules

### Must Do

- Use **TypeScript strict mode** — no `any`, no `@ts-ignore` without comment
- Use **functional components + hooks** only — no class components
- Use **arrow functions** for all functions, components, and hooks — no `function` keyword declarations
- Keep **screens thin** — no inline business logic or direct API calls in `app/`
- Use **TanStack Query** for ALL server state (fetching, caching, loading/error)
- Use **Zustand** ONLY for local UI state (timestamps, flags)
- Define query keys in `src/shared/services/queryKeys.ts` — no inline string keys
- Use **NativeWind** utility classes — no StyleSheet.create unless unavoidable
- All API calls must be **typed end-to-end** with response interfaces
- Pass ESLint and Prettier — warnings are errors

### Must NOT Do

- Do NOT store API response data in Zustand
- Do NOT use `useEffect` to trigger fetches — TanStack Query handles it
- Do NOT import between feature folders (coins ↔ coin-detail)
- Do NOT add `useMemo` / `useCallback` — React Compiler handles memoization
- Do NOT add abstractions for one-time operations
- Do NOT create a design system — use plain NativeWind classes
- Do NOT use `any` types anywhere
- Do NOT disable ESLint rules without a comment explaining why

## Patterns

### Adding a new API endpoint

See [docs/api.instructions.md](docs/api.instructions.md)

### State management boundaries

See [docs/state-management.instructions.md](docs/state-management.instructions.md)

### Component structure

See [docs/components.instructions.md](docs/components.instructions.md)

### Testing approach

See [docs/testing.instructions.md](docs/testing.instructions.md)

## Anti-Patterns

| Anti-Pattern                                                | Why It's Wrong               | Correct Approach                    |
| ----------------------------------------------------------- | ---------------------------- | ----------------------------------- |
| `const [coins, setCoins] = useState()` + `useEffect(fetch)` | Duplicates TQ's job          | Use `useQuery` / `useInfiniteQuery` |
| `useCoinStore.setState({ coins: data })`                    | Server data in Zustand       | Let TQ own it                       |
| `queryKey: ['coins']` inline                                | Breaks key management        | Use `queryKeys.coins.list()`        |
| `import { X } from '../coin-detail/...'` inside coins/      | Cross-feature dependency     | Move X to shared/                   |
| `StyleSheet.create({ ... })` for simple layouts             | Inconsistent with NativeWind | Use `className="..."`               |

## Key Files

- `src/shared/services/api.ts` — API client (fetch-based, typed)
- `src/shared/services/queryKeys.ts` — Central query key factory
- `src/shared/store/useCoinStore.ts` — Zustand store (timestamps only)
- `src/constants/config.ts` — All config values
- `src/shared/types/api.types.ts` — Shared Coin type and API response types
