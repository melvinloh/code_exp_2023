import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// Import your app logo image
import AppLogo from '../assets/app-logo.png';

const SplashScreen = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animatePulse = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animatePulse());
    };

    animatePulse();
  }, [scaleValue, opacityValue]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={AppLogo}
        style={[
          styles.image,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  image: {
    width: 125,
    height: 125,
  },
});

export default SplashScreen;


