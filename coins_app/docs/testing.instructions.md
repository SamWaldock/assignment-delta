# Testing Instructions

## Testing Stack

- **Unit/Integration**: Jest + React Native Testing Library
- **E2E**: Maestro

## What to Test

### High-Value Targets

Focus on testing components, hooks, and stores that:

- Contain business logic or data transformation
- Handle user interaction (e.g., button presses, input changes)
- Integrate with APIs or async data (e.g., hooks using TanStack Query)
- Manage local state (e.g., Zustand stores)
- Display error, loading, or empty states

**Examples:**

- List items/components that render dynamic data (e.g., CoinListItem)
- Error or empty state components (e.g., ErrorState)
- Custom hooks that fetch or transform data (e.g., useCoin)
- Stores that update or persist state (e.g., useCoinStore)

> **Tip:** When adding new features, add tests for any new logic, data fetching, or user interaction. Update this section only if new testing patterns emerge, not for every new component.

### What NOT to Test

- Navigation wiring (covered by Maestro E2E)
- Third-party library internals (TanStack Query, Zustand core, NativeWind)
- Styling details

## Mocking Patterns

### Mock fetch (for API hooks)

```typescript
jest.spyOn(global, 'fetch').mockResolvedValueOnce({
  ok: true,
  json: () => Promise.resolve(mockData),
} as Response);
```

### Mock TanStack Query Provider (for hook tests)

```typescript
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```

### Mock expo-router (for component tests)

```typescript
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'test-id' }),
}));
```

### Mock NetInfo (done globally in jest-setup.ts)

```typescript
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(() => ({ isConnected: true })),
  addEventListener: jest.fn(() => jest.fn()),
}));
```

## Jest Configuration

- Preset: `jest-expo`
- Setup file: `jest-setup.ts` (global mocks for NetInfo, expo-image)
- Module mapper: `@/` → `<rootDir>/`
- Transform ignore: configured for React Native + Expo ecosystem packages

## Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run a specific test
npx jest __tests__/shared/components/ErrorState.test.tsx
```

## E2E Tests (Maestro)

### E2E Flow Criteria

When designing Maestro E2E flows, ensure you:

- Cover critical user journeys (e.g., list-to-detail navigation, data refresh)
- Validate data loads, pagination, and error handling
- Test user interactions (taps, scrolls, refreshes)
- Confirm state persistence after navigation or refresh

> **Tip:** Flows should reflect real user behavior and verify that the app responds correctly to both success and failure scenarios.

### Running Maestro

```bash
# Start app on simulator first
npx expo start --ios

# Run flow
maestro test .maestro/coin-list-to-detail.yaml
```
