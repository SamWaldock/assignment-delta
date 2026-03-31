jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(() => ({
    isConnected: true,
    isInternetReachable: true,
  })),
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true }),
  ),
}));

jest.mock('expo-image', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest mock requires CommonJS
  const { View } = require('react-native');
  return {
    Image: View,
  };
});
