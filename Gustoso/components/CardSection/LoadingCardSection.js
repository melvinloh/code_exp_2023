import React from 'react';
import { View, ScrollView, Dimensions, Text, StyleSheet } from 'react-native';
import LoadingCard from './LoadingCard';

const { width, height } = Dimensions.get('window');
const cardMaxHeight = height / 4 - 20; // Adjust the card height as needed

const LoadingCardSection = ({title}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Disable scrolling
      >
        <View style={styles.cardContainer}>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: cardMaxHeight,
    marginVertical: 10,
    alignSelf: 'flex-start', // Align the container to the left
  },
  cardContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LoadingCardSection;
