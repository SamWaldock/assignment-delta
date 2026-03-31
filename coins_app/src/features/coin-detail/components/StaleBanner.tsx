import { Text, View } from 'react-native';

export const StaleBanner = () => {
  return (
    <View className="bg-yellow-500 px-4 py-2">
      <Text className="text-center text-sm font-medium text-white">
        Showing cached data — may be outdated
      </Text>
    </View>
  );
};
