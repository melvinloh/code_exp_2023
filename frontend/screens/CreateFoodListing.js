import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FoodContext } from '../contexts/FoodContext';
import { AuthContext } from '../contexts/AuthContext';
import LocationSearch from '../components/LocationSearch/LocationSearch';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import Taskbar from '../components/Taskbar/Taskbar';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

const CreateFoodListing = ({ route }) => {

  const navigation = useNavigation();
  const { params } = route;
  const id = params ? params.id : null;

  const { isLoggedIn, domain, userId } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Choose pickup location...');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showLocationSearchComponent, setShowLocationSearchComponent] = useState(false);

  const { foodCategories } = useContext(FoodContext);

  const fetchFoodDetails = async () => {

    if (id) {
      try {
        const response = await axios.get(`${domain}/api/food/${id}`);
        console.log('hello world');
        console.log(response.data);
        const data = await response.data; 
        setSelectedCategory(data.category);
        setDescription(data.description);
        setExpirationDate(new Date(data.expiration_date));
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setPickupLocation(data.pickup_location);
        setPrice(data.price);
        setTitle(data.title);
        setImageFile(`${domain + data.food_image_url}`)


        
      } catch (error) {
        console.log('Error fetching food details:', error);
      }
    }
  };

  useEffect(() => {
    // Fetch food details when the screen mounts
    fetchFoodDetails();

    // Clean up function to cancel any ongoing requests or subscriptions
    return () => {
      // Add any necessary cleanup logic here
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Fetch food details when the screen gains focus
      fetchFoodDetails();

      // Clean up function to cancel any ongoing requests or subscriptions
      return () => {
        // Add any necessary cleanup logic here
      };
    }, [])
  );



  const handleLocationSearchComponentToggle = () => {
    setShowLocationSearchComponent((prevState) => !prevState);
  };

  const updatePickupLocation = (locationData) => {
    setLongitude(locationData.coordinates[0]);
    setLatitude(locationData.coordinates[1]);
    setPickupLocation(locationData.display_name);
  };


  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access the camera and media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setImageFile(pickerResult.uri);
    }
  };


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expirationDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpirationDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    // Validate form fields
    if (!title || !description || !price || !pickupLocation || pickupLocation === 'Choose pickup location...' || !selectedCategory) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!imageFile) {
      alert('Please upload an image.');
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('image', {
      uri: imageFile,
      name: 'food_image.jpg',
      type: 'image/jpeg',
    });
    formData.append('userId', userId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('pickupLocation', pickupLocation);
    formData.append('longitude', longitude);
    formData.append('latitude', latitude);
    formData.append('selectedCategory', selectedCategory);
    // convert to date string first!!!
    formData.append('expirationDate', expirationDate.toDateString());


    if (id) {

      try {
        formData.append('foodId', id);
        // Send form data to the backend
        const response = await axios.post(`${domain}/api/edit-food-listing/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Show success message and navigate to HomeScreen
        alert('Food listing updated successfully.');
        navigation.navigate('Home');
      } catch(error) {
        alert('Failed to update food listing.');
      }

    } else {

      try {
        // Send form data to the backend
        const response = await axios.post(`${domain}/api/create-food-listing/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Show success message and navigate to HomeScreen
        alert('Food listing created successfully.');
        navigation.navigate('Home');
      } catch (error) {
        alert('Failed to create food listing.');
      }

    }


  };

    // taskbar stuff
    const [activeButton, setActiveButton] = useState('create');
    const handleButtonPress = (buttonName) => {
      setActiveButton(buttonName);
    };

  return (
    <View style={{flex: 1}}>
    <View style={styles.container}>
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      { !showLocationSearchComponent && <Text style={styles.title}>Sell Perishable Foods Here</Text> }
    </View>

      {showLocationSearchComponent ? (
        <LocationSearch updatePickupLocation={updatePickupLocation} closeLocationSearch={() => setShowLocationSearchComponent(false)} />
      ) : (
        <View>

          <View style={styles.uploadButtonContainer}>
            {imageFile && <Image source={{ uri: imageFile }} style={styles.image} />}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={[styles.uploadRemoveButton, {backgroundColor: 'orange'}]} onPress={handleImageUpload}>
                <FontAwesome name="photo" size={18} color="white" />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.uploadRemoveButton, {backgroundColor: 'red'}]} onPress={() => setImageFile(null)}>
                <FontAwesome name="times" size={18} color="white" />
                <Text style={styles.uploadButtonText}>Remove</Text>
              </TouchableOpacity>

            </View>
           
          
          </View>

          <View style={styles.picker}>
            <Picker
              style={styles.pickerInput}
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select a food category..." value="" />
              {foodCategories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you selling today?"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
            style={styles.input}
            placeholder="Add a description to let others know more..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2} // Adjust the number of lines as needed
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>$ Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Estimated Expiration Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Expiration Date"
              value={expirationDate.toDateString()}
              onFocus={showDatepicker}
            />
            {showDatePicker && (
              <DateTimePicker
                value={expirationDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={[styles.locationContainer, styles.input]}>
            <Ionicons name="location" size={24} color="gray" style={styles.locationIcon} />
            <TouchableOpacity style={styles.locationButton} onPress={() => setShowLocationSearchComponent(true)}>
              <Text style={[styles.buttonText,  styles.locationText, {color: 'gray', }]}>{pickupLocation}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{id ? 'Update Listing' : 'Submit New Listing'}</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
      <View>
      {isLoggedIn && <HideWithKeyboard><Taskbar activeButton={'create'} onPressButton={handleButtonPress} /></HideWithKeyboard>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 20,
    marginBottom: 10,
  },
  pickerItem: {
    fontSize: 15,
  },
  pickerInput: {
    height: 40,
    marginBottom: 10,
    
  },
  formGroup: {
    marginBottom: 5,
  },
  label: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationButton: {
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  uploadRemoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: 'orange',
  },
  buttonText: {
    textAlign: 'left',
    fontWeight: 'bold',
    paddingVertical: 0,
    paddingHorizontal: 7,
    color: 'white',
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
  },
  uploadButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    aspectRatio: 1,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CreateFoodListing;
