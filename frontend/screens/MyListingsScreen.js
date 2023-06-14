import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Swipeable from 'react-native-swipeable';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Taskbar from '../components/Taskbar/Taskbar';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { Ionicons } from '@expo/vector-icons';
import EmptyListings from '../modules/EmptyListings';
import SplashScreen from './SplashScreen';

const MyListingScreen = () => {
  const navigation = useNavigation();
  const { isLoggedIn, domain, userId } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    // taskbar stuff
    const [activeButton, setActiveButton] = useState('listings');
    const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
    };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('userId', userId);

      const response = await axios.post(`${domain}/api/get-my-listings/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setListings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching my listings:', error);
    }
  };

  const handleCardPress = (id) => {
    navigation.navigate('FoodDetailScreen', { id });
  };

  const handleDeleteCard = async (id) => {
    try {
      // Send a request to the backend to delete the listing
      const formData = new FormData();
      formData.append('listingId', id);

      await axios.post(`${domain}/api/delete-listing/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Remove the listing from the local state (if axios has no errors)
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));

      Alert.alert('Success', 'Listing deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete listing');
    }
  };

  const renderCard = ({ item }) => {
    const rightButtons = [
      <TouchableOpacity
        style={[styles.swipeButton, { backgroundColor: 'red' }]}
        onPress={() => handleDeleteCard(item.id)}
      >
        <Ionicons name="md-trash-bin" size={24} color="white" />
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>,
    ];

    return (
      <Swipeable rightButtons={rightButtons}>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item.id)}>
          <Image source={{ uri: `${domain + item.image}` }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (isLoading) {
    return (
        <SplashScreen />
    );
  }

  if (listings.length === 0 && !isLoading) {
    return (
        <EmptyListings 
            description={'You have no food listings to show'}
            handleButtonPress={() => navigation.navigate('CreateFoodListing')}
            buttonText={'Sell your perishables now'}
        />
    );
  }

  return (
    <View style={{flex: 1}}>
    <View style={styles.outerContainer}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.title}>My Listings</Text> 
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      </View>
      <FlatList
        data={listings}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </View>

        <View>
            {isLoggedIn && <HideWithKeyboard><Taskbar activeButton={'listings'} onPressButton={handleButtonPress} /></HideWithKeyboard>}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  container: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: 'gray',
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    marginLeft: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default MyListingScreen;
