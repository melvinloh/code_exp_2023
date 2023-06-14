import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const EmptyListings = ({description, handleButtonPress, buttonText}) => {

  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../assets/food-stand-no-listing.png')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>{description}</Text>
      <TouchableOpacity
        style={styles.sellButton}
        onPress={handleButtonPress}
      >
        <Text style={styles.sellButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sellButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },
  sellButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmptyListings;
