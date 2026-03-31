import type { Coin } from '@/src/shared/types/api.types';
import { formatPrice } from '@/src/shared/utils/formatPrice';
import { getCoinIconUrl } from '@/src/shared/utils/getCoinIconUrl';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface CoinListItemProps {
  coin: Coin;
}

export const CoinListItem = ({ coin }: CoinListItemProps) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/coin/${coin.id}`)}
      className="flex-row items-center border-b border-gray-100 bg-white px-4 py-3"
      accessibilityRole="button"
      accessibilityLabel={`${coin.name}, ${formatPrice(coin.priceInUSD)}`}
    >
      <Image
        source={{ uri: getCoinIconUrl(coin.id) }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
        contentFit="cover"
        transition={200}
        recyclingKey={coin.id}
      />
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {coin.name}
        </Text>
        <Text className="text-sm text-gray-500">{coin.dirtyCode}</Text>
      </View>
      <Text className="text-base font-medium text-gray-900">
        {formatPrice(coin.priceInUSD)}
      </Text>
    </Pressable>
  );
};
