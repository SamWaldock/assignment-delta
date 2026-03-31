import { Text, View } from 'react-native';

interface LastUpdatedBannerProps {
  timestamp: number | undefined;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const LastUpdatedBanner = ({ timestamp }: LastUpdatedBannerProps) => {
  if (!timestamp) return null;

  return (
    <View className="bg-gray-100 px-4 py-2">
      <Text className="text-center text-xs text-gray-500">
        Last updated at {formatTimestamp(timestamp)}
      </Text>
    </View>
  );
};
