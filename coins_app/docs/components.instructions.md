# Component Instructions

## Component Structure

### Screen Components (`app/`)

- Thin wrappers — import hooks and feature components, render them
- No business logic, no direct API calls
- Handle layout composition (banners, states, lists)

### Feature Components (`src/features/*/components/`)

- Self-contained to their feature
- Receive data via props — do not call hooks internally (except router)
- Use NativeWind `className` for styling

### Shared Components (`src/shared/components/`)

- Used by 2+ features
- Generic, reusable
- Props-driven with clear interfaces

## Styling

Use NativeWind (Tailwind CSS) utility classes:

```tsx
<View className="flex-1 items-center justify-center px-4">
  <Text className="text-lg font-semibold text-gray-900">Hello</Text>
</View>
```

- Do NOT use `StyleSheet.create` unless necessary (e.g., Animated.View style prop)
- Do NOT create a design system — plain utility classes are sufficient
- Use `className` on View, Text, Pressable, ScrollView, etc.

## Memoization

React Compiler is enabled via `babel-plugin-react-compiler`. It automatically memoizes components and hooks.

- Do NOT manually add `React.memo()`, `useMemo()`, or `useCallback()`
- React Compiler handles this automatically
- If a performance issue arises, profile first before adding manual optimization

## Images

Use `expo-image` for all images:

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: getCoinIconUrl(coin.id) }}
  style={{ width: 40, height: 40, borderRadius: 20 }}
  contentFit="cover"
  transition={200}
  recyclingKey={coin.id}
/>;
```

- Use `recyclingKey` in lists for proper recycling
- Use `transition` for smooth loading

## Lists

Use LegendList (`@legendapp/list`) instead of FlatList:

```tsx
import { LegendList } from '@legendapp/list';

<LegendList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={64}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>;
```

## Props Interface Pattern

Define props interfaces directly above the component:

```tsx
interface CoinListItemProps {
  coin: Coin;
}

export const CoinListItem = ({ coin }: CoinListItemProps) => { ... };
```
