import type { Coin } from '@/src/shared/types/api.types';
import { formatPrice, formatUSD } from '@/src/shared/utils/formatPrice';
import { getCoinIconUrl } from '@/src/shared/utils/getCoinIconUrl';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

interface CoinDetailCardProps {
  coin: Coin;
}

const formatSupply = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return value.toLocaleString('en-US');
};

const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const StatRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-medium text-gray-900">{value}</Text>
    </View>
  );
};

const PercentRow = ({ label, value }: { label: string; value: number }) => {
  const color = value >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={`text-sm font-medium ${color}`}>
        {formatPercent(value)}
      </Text>
    </View>
  );
};

export const CoinDetailCard = ({ coin }: CoinDetailCardProps) => {
  return (
    <View className="bg-white px-4 py-6">
      <View className="mb-6 items-center">
        <Image
          source={{ uri: getCoinIconUrl(coin.id) }}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          contentFit="cover"
          transition={200}
        />
        <Text className="mt-3 text-2xl font-bold text-gray-900">
          {coin.name}
        </Text>
        <Text className="text-base text-gray-500">{coin.dirtyCode}</Text>
        <Text className="mt-1 text-3xl font-bold text-gray-900">
          {formatPrice(coin.priceInUSD)}
        </Text>
      </View>

      <View className="rounded-lg bg-gray-50 px-4">
        <StatRow label="Market Cap Rank" value={`#${coin.marketCapRank}`} />
        <StatRow label="Market Cap" value={formatUSD(coin.marketCapInUSD)} />
        <StatRow label="24h Volume" value={formatUSD(coin.volume24hInUSD)} />
        <StatRow
          label="Available Supply"
          value={formatSupply(coin.availableSupply)}
        />
        <StatRow label="Total Supply" value={formatSupply(coin.totalSupply)} />
        <PercentRow label="Change (1h)" value={coin.percentChange1h} />
        <PercentRow label="Change (24h)" value={coin.percentChange24h} />
        <PercentRow label="Change (7d)" value={coin.percentChange7d} />
      </View>

      {coin.showDisclaimer && (
        <View className="mt-4 rounded-lg bg-yellow-50 px-4 py-3">
          <Text className="text-xs text-yellow-800">
            ⚠ This coin has low liquidity or unreliable data. Please exercise
            caution.
          </Text>
        </View>
      )}
    </View>
  );
};
