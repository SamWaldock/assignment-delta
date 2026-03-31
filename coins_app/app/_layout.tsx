import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

const RootLayout = () => {
  SplashScreen.hideAsync();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="coin/[id]"
          options={{
            headerBackTitle: 'Back',
            title: 'Coin Detail',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
