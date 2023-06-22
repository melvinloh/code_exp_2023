import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

import SearchIcon from '../../assets/icons/search-icon.png';
import CloseIcon from '../../assets/icons/close-icon.png';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

let debounceTimer = null;

const SearchBar = ({handleSearchField, searchResults, searchIsLoading}) => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const searchInputRef = useRef(null);
  const { isLoggedIn, domain, userId } = useContext(AuthContext);
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

  const handleImageUpload = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access the camera and media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setIsAnalyzingImage(true);
      const newUrl = await resizeImage(pickerResult.uri);
      
      const file = {
        // uri can also be a file system path (i.e. file://)
        uri: newUrl,
        name: generateUniqueFileName(getFileExtension(newUrl)),
        type: `image/${getFileExtension(newUrl)}`,
      }

      const options = {
        keyPrefix: "search_images/",
        bucket: "gust-images",
        region: "ap-southeast-1",
        accessKey: "AKIAZSQ3HGLXG4I2QS2P",
        secretKey: "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",
        successActionStatus: 201
      }
  
  
      try {
        const response = await new Promise((resolve, reject) => {
          RNS3.put(file, options)
            .then(resolve)
            .catch(reject);
        });
        // sending to url to backend for image recognition
        const payloadUrl = response.body.postResponse.location;
        
        const formData = new FormData();
        formData.append('url', payloadUrl);
  
        const responseUrl = await axios.post(`${domain}/api/search-listings-image/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setSearchText(responseUrl.data.tag);
        setIsAnalyzingImage(false);
  
      } catch (error) {
        console.log(error);
        alert("Image search failed");
        setIsAnalyzingImage(false);
      }
    }
  };


      

  // for creating unique image file name
  const generateUniqueFileName = (fileExtension) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${randomString}.${fileExtension}`;
  }

  const getFileExtension = (filePath) => {
    const fileName = filePath.split('/').pop(); // Extract the file name from the path
    const fileExtension = fileName.split('.').pop(); // Extract the file extension from the file name
    return fileExtension;
  }

  const resizeImage = async (imageUri) => {

      try {
        const resizedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { height: 480 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        // The resized image is available in the `resizedImage.uri` property
        console.log('successfully resize image');
        return resizedImage.uri;
      } catch (error) {
        console.log('resize image error');
        return imageUri;
      }

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
        {searchText !== '' ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <View style={{ backgroundColor: 'lightgray', padding: 2, marginHorizontal: 10, borderRadius: 20 }}>
              <Image
                source={CloseIcon}
                style={{ width: 15, height: 15, tintColor: 'white' }}
              />
            </View>
          </TouchableOpacity>
        ): (
          <>
            {!isAnalyzingImage &&           
              <TouchableOpacity onPress={handleImageUpload}>
                <View style={{ padding: 2, paddingRight: 15 }}>
                  <Ionicons name="camera-outline" size={25} color="orange" style={{ width: 25, height: 25 }} />
                </View>
              </TouchableOpacity>
            }
            {isAnalyzingImage && 
              <View style={{ padding: 2, paddingRight: 15 }}>
                  <ActivityIndicator size="small" color="#FFA500" />
              </View>
           }

          </>
          
        )}
      </View>

      {searchText !== '' && (
        
      <View>
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }} scrollEnabled={true} showsVerticalScrollIndicator={false}>
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
