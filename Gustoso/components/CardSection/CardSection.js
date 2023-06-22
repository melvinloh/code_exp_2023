import React from 'react';
import { View, ScrollView, Dimensions, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const cardMaxHeight = height / 4 - 20; // Adjust the card height as needed

const CardSection = ({title, listings}) => {
  const navigation = useNavigation();
  const handleCardPress = (id) => {
    // must use exact term 'id'
    navigation.navigate('FoodDetailScreen', { id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
        {listings.map((item) => (
            <Card
              key={item.id}
              food_image_url={item.food_image_url}
              title={item.title}
              category={item.category}
              onPress={() => handleCardPress(item.id)}
            />
          ))}
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

export default CardSection;
