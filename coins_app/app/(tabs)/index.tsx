import { CoinListItem } from '@/src/features/coins/components/CoinListItem';
import { CoinListSkeleton } from '@/src/features/coins/components/CoinListSkeleton';
import { useCoinList } from '@/src/features/coins/hooks/useCoinList';
import { ErrorState } from '@/src/shared/components/ErrorState';
import { OfflineBanner } from '@/src/shared/components/OfflineBanner';
import { useNetworkStatus } from '@/src/shared/hooks/useNetworkStatus';
import type { Coin } from '@/src/shared/types/api.types';
import { LegendList } from '@legendapp/list';
import { ActivityIndicator, Text, View } from 'react-native';

const CoinListScreen = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useCoinList();

  const { isConnected } = useNetworkStatus();

  const coins: Coin[] = data?.pages.flatMap((page) => page.data) ?? [];
  const hasData = coins.length > 0;
  const showOfflineBanner = !isConnected && hasData;
  const showStaleBanner = isError && hasData && isConnected;

  if (isLoading && !hasData) {
    return <CoinListSkeleton />;
  }

  if (isError && !hasData) {
    return (
      <ErrorState
        message={error?.message ?? 'Failed to load coins'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      {showOfflineBanner && <OfflineBanner />}
      {showStaleBanner && (
        <View className="bg-yellow-500 px-4 py-2">
          <Text className="text-center text-sm font-medium text-white">
            Showing cached data — may be outdated
          </Text>
        </View>
      )}
      <LegendList
        data={coins}
        renderItem={({ item }: { item: Coin }) => <CoinListItem coin={item} />}
        keyExtractor={(item: Coin) => item.id}
        estimatedItemSize={64}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default CoinListScreen;
