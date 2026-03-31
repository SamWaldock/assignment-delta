import NetInfo from '@react-native-community/netinfo';
import { useSyncExternalStore } from 'react';

let isConnected = true;

const listeners = new Set<() => void>();

const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
  const newValue = state.isConnected ?? true;
  if (newValue !== isConnected) {
    isConnected = newValue;
    listeners.forEach((listener) => listener());
  }
});

// Prevent unused variable warning — the subscription is kept alive for the app lifetime
void unsubscribeNetInfo;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => {
  return isConnected;
};

export const useNetworkStatus = () => {
  const connected = useSyncExternalStore(subscribe, getSnapshot, () => true);
  return { isConnected: connected };
};
