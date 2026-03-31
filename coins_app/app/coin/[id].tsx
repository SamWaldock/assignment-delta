import { CoinDetailCard } from '@/src/features/coin-detail/components/CoinDetailCard';
import { LastUpdatedBanner } from '@/src/features/coin-detail/components/LastUpdatedBanner';
import { StaleBanner } from '@/src/features/coin-detail/components/StaleBanner';
import { useCoin } from '@/src/features/coin-detail/hooks/useCoin';
import { ErrorState } from '@/src/shared/components/ErrorState';
import { OfflineBanner } from '@/src/shared/components/OfflineBanner';
import { useNetworkStatus } from '@/src/shared/hooks/useNetworkStatus';
import { useCoinStore } from '@/src/shared/store/useCoinStore';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

const CoinDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch, isFetching } = useCoin(
    id ?? '',
  );
  const { isConnected } = useNetworkStatus();
  const lastUpdated = useCoinStore(
    (state) => state.lastUpdatedTimestamps[id ?? ''],
  );

  const coin = data?.data;
  const hasData = !!coin;
  const showStaleBanner = hasData && (isError || !isConnected);

  if (isLoading && !hasData) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError && !hasData) {
    return (
      <ErrorState
        message={error?.message ?? 'Failed to load coin details'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!coin) return null;

  return (
    <>
      <Stack.Screen options={{ title: coin.name }} />
      {!isConnected && <OfflineBanner />}
      {showStaleBanner && isConnected && <StaleBanner />}
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
          />
        }
      >
        <CoinDetailCard coin={coin} />
        <LastUpdatedBanner timestamp={lastUpdated} />
      </ScrollView>
    </>
  );
};

export default CoinDetailScreen;
