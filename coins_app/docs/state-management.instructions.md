# State Management Instructions

## Boundary: TanStack Query vs Zustand

### TanStack Query Owns

- ALL data fetched from the Delta API
- Loading, error, and success states for API calls
- Cache management (staleTime, gcTime)
- Background refetching
- Pagination state (infinite query pages)

### Zustand Owns

- `lastUpdatedTimestamps` — when each coin detail was last fetched (local timestamps, not API values)
- Any future UI-only flags (e.g., user preferences)

### What Goes Where?

| Data                   | Owner                 | Why                |
| ---------------------- | --------------------- | ------------------ |
| Coin list data         | TanStack Query        | Server data        |
| Coin detail data       | TanStack Query        | Server data        |
| Loading/error states   | TanStack Query        | Derived from query |
| Last-updated timestamp | Zustand               | Local UI state     |
| isConnected (network)  | useNetworkStatus hook | Device state       |

## Cache Configuration

Defined in `src/constants/config.ts`:

```typescript
COIN_LIST_STALE_TIME = 60_000; // 60 seconds
COIN_DETAIL_STALE_TIME = 30_000; // 30 seconds
CACHE_GC_TIME = 300_000; // 5 minutes
```

## Query Key Conventions

All keys defined in `src/shared/services/queryKeys.ts`. Structure:

```typescript
queryKeys.coins.all; // invalidate everything coin-related
queryKeys.coins.list(); // the paginated list
queryKeys.coins.detail(id); // a specific coin's detail
```

Never use inline string arrays for query keys.

## Setting the Last-Updated Timestamp

The timestamp is set inside the `queryFn` of `useCoin`, NOT in a `useEffect`:

```typescript
queryFn: async () => {
  const data = await fetchCoinDetail(id);
  useCoinStore.getState().setLastUpdated(id);
  return data;
},
```

This ensures the timestamp is set when the fetch completes, regardless of React rendering timing.
