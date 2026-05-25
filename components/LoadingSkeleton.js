import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const LoadingSkeleton = ({ count = 3 }) => {
  const opacity = new Animated.Value(0.3);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();

  const renderSkeletonItem = (index) => (
    <Animated.View key={index} style={[styles.skeletonItem, { opacity }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        <View style={styles.skeletonLine} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => renderSkeletonItem(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeletonItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  skeletonImage: {
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '60%',
  },
});

export default LoadingSkeleton;