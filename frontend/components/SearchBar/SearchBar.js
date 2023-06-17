import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, Image } from 'react-native';

import SearchIcon from '../../assets/icons/search-icon.png';
import CloseIcon from '../../assets/icons/close-icon.png';
import { useNavigation } from '@react-navigation/native';

let debounceTimer = null;

const SearchBar = ({handleSearchField, searchResults, searchIsLoading}) => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);
  const navigation = useNavigation();

  // using debounce to prevent too many calls at once
  useEffect(() => {
    setIsLoading(true); // Set isLoading to true when the user types
    debounceSearchField();
  }, [searchText, setIsLoading]); // Add setIsLoading as a dependency

  const debounceSearchField = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      handleSearchField(searchText);
      setIsLoading(searchIsLoading);
    }, 300);
  };

  const handleSearch = async () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    handleSearchField(searchText);

  };

  const handleClearSearch = () => {
    searchInputRef.current.focus();
    setSearchText('');
  };



  return (
    <View style={{ marginVertical: 10, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'orange', borderRadius: 20, backgroundColor: '#F9F9F9', width: '100%' }}>
        <View style={{ paddingLeft: 10 }}>
          {/* SVG icon can be replaced with an image */}
          <Image
            source={SearchIcon}
            style={{ width: 20, height: 20, tintColor: 'orange' }}
          />
        </View>
        <TextInput
          ref={searchInputRef}
          style={{ flex: 1, padding: 10, fontSize: 14, color: 'black' }}
          placeholder="Search for food perishables..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={handleSearch}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={handleClearSearch}>
            <View style={{ backgroundColor: 'lightgray', padding: 2, marginHorizontal: 8, borderRadius: 20 }}>
              <Image
                source={CloseIcon}
                style={{ width: 15, height: 15, tintColor: 'white' }}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {searchText !== '' && (
        
      <View>
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
          {isLoading && <View><Text style={{ fontSize: 14, color: 'black', marginBottom: 5, textAlign: 'center', }}>Loading...</Text></View>}
          {!isLoading && searchResults.length === 0 && <View><Text style={{ fontSize: 14, color: 'black', marginBottom: 5, textAlign: 'center', }}>No matching results to show</Text></View>}
          {!isLoading && searchResults.map((item) => (
            <View key={item.id} style={{ paddingVertical: 18, paddingHorizontal: 8, backgroundColor: 'white', marginBottom: 10 }}>
              <TouchableOpacity onPress={() => {navigation.navigate('FoodDetailScreen', { id: item.id }) }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 2 }} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                <Text style={{ fontSize: 12, color: 'black', marginBottom: 2 }} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      )}

    </View>
  );
};

export default SearchBar;
