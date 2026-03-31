# API Instructions

## Base Configuration

- **Base URL**: `https://api.getdelta.io`
- **Icon URL**: `https://delta.app/images/{id}/icon-64.png`
- **Client**: Native `fetch` (no axios)
- **Types**: `src/shared/types/api.types.ts`
- **Service**: `src/shared/services/api.ts`

## Existing Endpoints

### Coin List (paginated)

```
GET /web/coins?page[number]={page}&page[size]={pageSize}
Response: CoinsListResponse { meta: CoinsMeta, data: Coin[] }
```

### Coin Detail

```
GET /web/coins/{id}
Response: CoinDetailResponse { meta: { success: boolean }, data: Coin }
```

## Adding a New Endpoint

1. **Define the response type** in `src/shared/types/api.types.ts`
2. **Add the fetch function** in `src/shared/services/api.ts`:
   - Use the `API_BASE_URL` constant
   - Check `response.ok` and throw on failure
   - Return typed response
3. **Add a query key** in `src/shared/services/queryKeys.ts`
4. **Create a hook** in the appropriate feature folder using `useQuery` or `useMutation`

## Error Handling Pattern

```typescript
export const fetchSomething = async (id: string): Promise<SomeResponse> => {
  const url = `${API_BASE_URL}/web/something/${encodeURIComponent(id)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch (status ${response.status})`);
  }

  return response.json() as Promise<SomeResponse>;
};
```

- Always check `response.ok`
- Always throw an `Error` with a descriptive message
- Always use `encodeURIComponent` for dynamic URL segments
- Let TanStack Query handle retries (configured to retry 2 times)

## Query Hook Pattern

```typescript
export const useSomething = (id: string) => {
  return useQuery({
    queryKey: queryKeys.something.detail(id),
    queryFn: () => fetchSomething(id),
    staleTime: SOME_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    enabled: !!id,
  });
};
```
