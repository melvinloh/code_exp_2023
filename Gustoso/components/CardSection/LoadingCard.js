import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');
const cardMaxWidth = width / 2 - 35; // Adjust the card width as needed
const cardMaxHeight = height / 5 - 19; // Adjust the card height as needed

const LoadingCard = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={{ width: cardMaxWidth, height: cardMaxHeight, borderRadius: 8, overflow: 'hidden', marginHorizontal: 4, }}>
      <View style={{ flex: 1, backgroundColor: '#CCCCCC', shadowColor: 'darkgray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 }}>
        {/* Placeholder for loading animation */}
        <Animated.View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', transform: [{ scale: scaleValue }] }}>
          <View style={{ width: '100%', height: '60%', backgroundColor: '#DDDDDD', borderRadius: 8 }} />
          <View style={{ marginTop: 12, marginHorizontal: 8, width: '50%', height: '10%', backgroundColor: '#DDDDDD', borderRadius: 8 }} />
          <View style={{ marginTop: 4, marginHorizontal: 8, width: '60%', height: '7%', backgroundColor: '#DDDDDD', borderRadius: 8 }} />
        </Animated.View>
      </View>
    </View>
  );
};

export default LoadingCard;
