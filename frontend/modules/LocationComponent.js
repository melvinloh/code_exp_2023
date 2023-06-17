import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState('Fetching location...');

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        const { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);

        const locationNameResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
        );
        const locationNameData = await locationNameResponse.json();
        if (locationNameData && locationNameData.display_name) {
          setLocationName(`Current Location: ${locationNameData.display_name}`);
        } else {
          setLocationName('Failed to fetch location');
        }
      } catch (error) {
        setErrorMsg(error.message);
        setLocationName('Failed to fetch location');
      }
    })();
  }, []);



  return (
    <View style={styles.container}>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.paragraph}>{locationName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 13,
    textAlign: 'left',
    fontWeight: 'bold',
    marginLeft: 14,
  },
});

export default LocationComponent;
