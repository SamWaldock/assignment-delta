import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, type ViewStyle } from 'react-native';

interface SkeletonBlockProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBlock = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonBlockProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e5e7eb',
          opacity,
        },
        style,
      ]}
    />
  );
};
