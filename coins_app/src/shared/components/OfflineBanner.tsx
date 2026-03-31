import { Text, View } from 'react-native';

export const OfflineBanner = () => {
  return (
    <View className="bg-orange-500 px-4 py-2">
      <Text className="text-center text-sm font-medium text-white">
        You are offline. Showing cached data.
      </Text>
    </View>
  );
};
