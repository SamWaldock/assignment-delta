import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="mb-4 text-xl font-bold">
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/">
          <Text className="text-base text-blue-600">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
