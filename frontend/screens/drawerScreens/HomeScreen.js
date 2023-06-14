import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FoodContext } from "../../contexts/FoodContext";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileButton from "../../modules/ProfileButton";
import LocationComponent from "../../modules/LocationComponent";

import SearchBar from "../../components/SearchBar/SearchBar";
import CardSection from "../../components/CardSection/CardSection";
import FoodCategory from "../../components/FoodCategory/FoodCategory";
import { useNavigation } from "@react-navigation/native";
import Taskbar from "../../components/Taskbar/Taskbar";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import axios from "axios";

const HomeScreen = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { foodCategories } = useContext(FoodContext);
  const { domain, userId, username, isLoggedIn } = authContext;
  const [nearYouListings, setNearYouListings] = useState([]);
  const [forYouListings, setForYouListings] = useState([]);

  const [showSearchComponent, setShowSearchComponent] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchNearYouListings();
    fetchForYouListings();
  }, []);

  // TODO: change the API to listings-near-you (may need to include Geolocation data)
  const fetchNearYouListings = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);

      const response = await axios.post(`${domain}/api/listings-near-you/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNearYouListings(response.data);
    } catch (error) {
      console.log('Error fetching near you listings:', error);
    }
  };

  const fetchForYouListings = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);

      const response = await axios.post(`${domain}/api/listings-for-you/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setForYouListings(response.data);
    } catch (error) {
      console.log('Error fetching for you listings:', error);
    }
  };

  // taskbar stuff
  const [activeButton, setActiveButton] = useState('home');
  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  };

  // category logic
  const renderCategoryItem = ({ item }) => (
    <FoodCategory item={item}/>
  );

  // search bar logic
  const handleSearchField = async (searchfield) => {
    if (searchfield !== '') {
      setShowSearchComponent(true);
      // Go and fetch results then set search results 
      try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('searchfield', searchfield);
  
        const response = await axios.post(`${domain}/api/search-listings/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setSearchResults(response.data);

      } catch (error) {
        console.log('Error fetching my listings:', error);
        setSearchResults([]);
        setShowSearchComponent(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchComponent(false);
    }

  };



  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.profileButtonContainer}>
        <ProfileButton username={username} />
        <LocationComponent />
      </View>

      <View style={{paddingHorizontal: 16}}>
        <SearchBar handleSearchField={handleSearchField} searchResults={searchResults}/>
      </View>

      <View style={styles.container}>
        {!showSearchComponent && (
            <>
            <FlatList
            style={styles.flatListContainer}
            data={foodCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            numColumns={4}
            scrollEnabled={false} // Disable scrolling
            showsVerticalScrollIndicator={false} // Hide the vertical scrollbar
            />

            <CardSection title={'Food near you'} listings={nearYouListings}/>
            <CardSection title={'Food you may like'} listings={forYouListings}/>

            </>
        )}
   
      </View>
      <HideWithKeyboard>
        <View>
          {isLoggedIn &&<Taskbar activeButton={'home'} onPressButton={handleButtonPress} />}
        </View>
      </HideWithKeyboard>
    </View>
  );
};

const styles = StyleSheet.create({
  profileButtonContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  flatListContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 4,
  },
  contentContainer: {
    marginBottom: 16,
  },
});

export default HomeScreen;
