module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@tanstack/react-query|zustand|nativewind|react-native-css-interop|@legendapp/list|expo-image)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
