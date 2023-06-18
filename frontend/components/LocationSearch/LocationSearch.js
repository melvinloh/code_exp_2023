import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ScrollView, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

import SearchIcon from '../../assets/icons/search-icon.png';
import CloseIcon from '../../assets/icons/close-icon.png';

// must declare outside scope
let debounceTimer;

const LocationSearch = ({ updatePickupLocation, closeLocationSearch }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      if (text !== '') {
        fetchSearchResults(text);
      } else {
        setSearchResults([]);
      }
    }, 300); // Set the debounce time to 300 milliseconds (adjust as needed)
  };

  const fetchSearchResults = async (text) => {
    try {
      const response = await axios.get(
        // limit the search to Singapore
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=geojson&countrycodes=SG`
      );
      const data = response.data;
      setSearchResults(data.features);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleSelectLocation = (location) => {
    // Extract the required data from the selected location
    updatePickupLocation({
      coordinates: location.geometry.coordinates,
      display_name: location.properties.display_name,
    });

    // Clear the search query and reset the search results
    setQuery('');
    setSearchResults([]);
    closeLocationSearch();
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleSelectLocation(item)}
    >
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={SearchIcon} style={styles.searchResultIcon} />
        <Text style={styles.searchResultText}>{item.properties.display_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const handleClearSearchQuery = () => {
    setQuery('');
    setSearchResults([]);
  }

  return (
    <View style={styles.container}>
      {/* contain back button and search bar */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>

      <View style={{ marginTop: 2, marginBottom: 20, }}>
        <TouchableOpacity onPress={closeLocationSearch}>
          <Ionicons name="md-arrow-back-circle-sharp" size={35} color="orange" />
        </TouchableOpacity>
      </View>

        <View style={styles.searchBarContainer}>

          <Image source={SearchIcon} style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search location..."
            value={query}
            onChangeText={handleSearch}
          />
          {query !== '' && (
            <TouchableOpacity onPress={handleClearSearchQuery}>
              <View style={{ backgroundColor: 'lightgray', padding: 2, marginHorizontal: 8, borderRadius: 20 }}>
                <Image
                  source={CloseIcon}
                  style={{ width: 15, height: 15, tintColor: 'white' }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

      </View>



        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.properties.place_id.toString()}
        />

    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    marginBottom: 16,
    paddingHorizontal: 10,
    marginLeft: 7,
    marginRight: 35,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: 'orange',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: 'black',
  },
  closeIcon: {
    width: 15,
    height: 15,
    tintColor: 'white',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 25,
  },
  searchResultIcon: {
    width: 20,
    height: 20,
  },
  searchResultText: {
    paddingLeft: 15,
    paddingRight: 2,
    fontSize: 16,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
};

export default LocationSearch;

