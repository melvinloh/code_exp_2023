import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

const FoodCategory = ({ item }) => {
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryListingScreen', { category });
  };


  const getImageSource = (category) => {
    // Mapping category names to corresponding image sources
    const imageMap = {
      Poultry: require('../../assets/icons/poultry.png'),
      Seafood: require('../../assets/icons/seafood.png'),
      Eggs: require('../../assets/icons/eggs.png'),
      Dairy: require('../../assets/icons/dairy.png'),
      'Cooked leftovers': require('../../assets/icons/cooked-leftovers.png'),
      Drinks: require('../../assets/icons/drinks.png'),
      'Fruits and Vegetables': require('../../assets/icons/fruits-and-vegetables.png'),
      'Canned Food': require('../../assets/icons/canned-food.png'),
    };
    return imageMap[category];
  };

  return (
    <TouchableOpacity
      key={item}
      onPress={() => handleCategoryPress(item)}
      style={styles.categoryItem}
    >
      <View style={styles.imageContainer}>
        <Image source={getImageSource(item)} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryText} numberOfLines={2} ellipsizeMode="tail">{item}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 165, 0, 0.5)', // Orange color with 60% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  categoryText: {
    width: 69,
    marginTop: 12,
    marginBottom: 'auto',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'top',
    textAlignVertical: 'top',
  },
});

export default FoodCategory;
