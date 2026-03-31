# Coins App

A React Native (Expo) mobile app that displays cryptocurrency data from the Delta API. Browse a paginated list of coins, view detailed information, and handle offline scenarios gracefully.

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Expo CLI**: `npm install -g expo-cli` (optional — `npx expo` works too)
- **iOS Simulator** (macOS): Xcode with iOS simulator installed
- **Android Emulator**: Android Studio with an AVD configured
- **Expo Go** app on a physical device (optional)
- **Maestro** (for E2E tests): [Install Maestro](https://maestro.mobile.dev/getting-started/installing-maestro)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run start`        | Start Expo dev server            |
| `npm run ios`          | Start on iOS simulator           |
| `npm run android`      | Start on Android emulator        |
| `npm run lint`         | Run ESLint                       |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check formatting without writing |
| `npm run test`         | Run Jest unit tests              |
| `npm run test:watch`   | Run Jest in watch mode           |

## Running Tests

### Unit Tests (Jest + React Native Testing Library)

```bash
npm run test
```

### E2E Tests (Maestro)

```bash
# First, start the app on a simulator/emulator
npx expo start --ios  # or --android

# Then run the Maestro flow
maestro test .maestro/coin-list-to-detail.yaml
```

## Project Structure

```
app/                          # Expo Router screens (thin — no business logic)
  (tabs)/
    index.tsx                 # Coin list screen
    _layout.tsx               # Tab navigator layout
  coin/
    [id].tsx                  # Coin detail screen
  _layout.tsx                 # Root stack layout

src/
  features/
    coins/                    # Coin list feature
      components/             # CoinListItem, CoinListSkeleton
      hooks/                  # useCoinList (useInfiniteQuery wrapper)
      coins.types.ts
    coin-detail/              # Coin detail feature
      components/             # CoinDetailCard, LastUpdatedBanner, StaleBanner
      hooks/                  # useCoin (useQuery wrapper)
      coin-detail.types.ts
  shared/
    components/               # ErrorState, OfflineBanner, SkeletonBlock
    hooks/                    # useNetworkStatus
    store/                    # Zustand store (useCoinStore)
    services/                 # API client, query keys
    utils/                    # getCoinIconUrl helper
    types/                    # Shared TypeScript types
  constants/
    config.ts                 # Base URLs, staleTime, gcTime, page size

__tests__/                    # Unit tests (mirrors src/ structure)
.maestro/                     # Maestro E2E test flows
docs/                         # Agent sub-instructions
```

## Tech Stack

- **Framework**: React Native via Expo (SDK 54)
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router
- **Server State**: TanStack Query v5
- **Client State**: Zustand
- **Styling**: NativeWind (Tailwind CSS for RN)
- **Lists**: LegendList (@legendapp/list)
- **Images**: expo-image
- **Testing**: Jest + React Native Testing Library + Maestro
- **Linting**: ESLint (eslint-config-expo) + Prettier + Husky pre-commit hook
