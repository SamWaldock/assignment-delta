import { Pressable, Text, View } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-2 text-center text-lg font-semibold text-red-600">
        Something went wrong
      </Text>
      <Text className="mb-6 text-center text-sm text-gray-600">{message}</Text>
      <Pressable
        onPress={onRetry}
        className="rounded-lg bg-blue-600 px-6 py-3"
        accessibilityRole="button"
        accessibilityLabel="Retry"
      >
        <Text className="font-semibold text-white">Retry</Text>
      </Pressable>
    </View>
  );
};
