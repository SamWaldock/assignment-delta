# Architecture

## Overview

The Coins App follows a feature-based architecture with clear separation between server state (API data) and client state (UI state).

## Data Flow

```
Delta API
   ↓
fetch (src/shared/services/api.ts)
   ↓
TanStack Query (caching, refetching, pagination)
   ↓
Custom hooks (useCoinList, useCoin)
   ↓
Screen components (app/ directory)
   ↓
Feature components (src/features/*)
```

## State Management

### Server State — TanStack Query

All API data flows through TanStack Query. It handles:

- **Fetching**: Automatic fetching on mount via query hooks
- **Caching**: Configurable `staleTime` and `gcTime` per query
- **Background refetch**: Automatic re-fetching when data becomes stale
- **Pagination**: `useInfiniteQuery` for the coin list with page-based pagination
- **Error/Loading states**: Built-in status tracking

### Client State — Zustand

Zustand only manages local UI state:

- `lastUpdatedTimestamps`: Records when each coin's data was last fetched (set in the queryFn when a fetch succeeds)

No API response data is duplicated in Zustand.

### Query Keys

All query keys are defined in `src/shared/services/queryKeys.ts`:

```typescript
queryKeys.coins.all      → ['coins']
queryKeys.coins.list()   → ['coins', 'list']
queryKeys.coins.detail(id) → ['coins', 'detail', id]
```

## Cache Configuration

| Query       | Stale Time | Cache (GC) Time |
| ----------- | ---------- | --------------- |
| Coin List   | 60 seconds | 5 minutes       |
| Coin Detail | 30 seconds | 5 minutes       |

## Offline Behavior

1. **NetInfo** detects connectivity changes via `useNetworkStatus` hook
2. When offline with cached data: show `OfflineBanner` + stale cached data
3. When offline without cache: show `ErrorState` with retry button
4. When back online: TanStack Query automatically refetches stale data

## Navigation

```
Stack Navigator (app/_layout.tsx)
├── Tab Navigator (app/(tabs)/_layout.tsx)
│   └── Coin List Screen (app/(tabs)/index.tsx)
└── Coin Detail Screen (app/coin/[id].tsx)
```

## Performance

- **React Compiler**: Enabled via `babel-plugin-react-compiler` for automatic memoization
- **LegendList**: Used instead of FlatList for better virtualization performance
- **expo-image**: Lazy-loads coin icons with built-in caching and transitions
- **Pagination**: List loads 50 coins per page via `useInfiniteQuery`

## Key Technical Decisions

### React Native Expo

As Expo has become the leading framework for rapidly building, testing, and deploying React Native apps, I decided to opt for this instead of bare React Native.

### Expo Router for Navigation

The file-based routing convention is slowly becoming a common pattern across different frameworks. It provides simplicity and structure. That’s why I opted for Expo Router instead of React Navigation.

### TanStack Query for Server State

TanStack Query is a great library for handling fetching, caching, and background updates. There are a lot of alternatives, but for this project it seemed like a strong choice—especially since we want to focus on caching for performance.

### Zustand for Client State

Personally, I’m a big fan of Zustand. It’s lightweight, requires minimal boilerplate, and gives developers a lot of freedom. An alternative would have been Redux Toolkit, but it introduces more complexity and boilerplate. From what I’ve seen in the docs, performance is also better with Zustand.

### LegendList for Lists

I opted for LegendList as it’s optimised for very large or dynamic lists and reduces re-renders compared to alternatives like FlatList and SectionList.

### expo-image for Images

For image loading, I decided to use expo-image. It’s fast, optimises image loading, and provides caching. I could have opted for React Native Image or FastImage, but since we’re using Expo, I prefer staying within the ecosystem and it’s a great choice regardless.

### Testing: Jest + RNTL + Maestro

This combination provides a solid setup for comprehensive unit, integration, and E2E testing. Jest + React Native Testing Library are the standard for unit and integration testing in React Native.

Maestro, on the other hand, has quite a few competitors. However, I’ve been using it since it was introduced, and it has consistently improved. The team provides great support, and new features are released quickly. It’s my go-to for E2E testing, though I’m definitely open to other frameworks as well.

### Linting: ESLint + Prettier

As discussed in the prompt documentation, I strongly believe in enforcing code quality and consistency across developers.
