import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');
const cardMaxWidth = width / 2 - 35; // Adjust the card width as needed
const cardMaxHeight = height / 5 - 19; // Adjust the card height as needed

const Card = ({onPress, food_image_url, title, category }) => {

  const { domain } = useContext(AuthContext);

  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, marginHorizontal: 4, }}>
      <View style={{ width: cardMaxWidth, height: cardMaxHeight, borderRadius: 8, overflow: 'hidden' }}>
        {/* card content */}
        <View style={{ flex: 1, backgroundColor: 'orange', shadowColor: 'darkgray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 }}>
          {/* card image */}
          <Image source={{ uri: `${food_image_url}` }} style={{ flex: 1, resizeMode: 'cover', width: cardMaxWidth, height: cardMaxHeight / 10 }} />
          {/* card text */}
          <View style={{ padding: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginBottom: 2 }} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            <Text style={{ fontSize: 12, color: 'white', marginBottom: 2 }} numberOfLines={1} ellipsizeMode="tail">{category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;