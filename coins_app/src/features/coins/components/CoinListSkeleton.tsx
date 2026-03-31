import { SkeletonBlock } from '@/src/shared/components/SkeletonBlock';
import { View } from 'react-native';

const SkeletonRow = () => {
  return (
    <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
      <SkeletonBlock width={40} height={40} borderRadius={20} />
      <View className="ml-3 flex-1">
        <SkeletonBlock width="60%" height={16} />
        <SkeletonBlock width="30%" height={12} style={{ marginTop: 6 }} />
      </View>
      <SkeletonBlock width={80} height={16} />
    </View>
  );
};

export const CoinListSkeleton = () => {
  return (
    <View className="flex-1 bg-white">
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </View>
  );
};
