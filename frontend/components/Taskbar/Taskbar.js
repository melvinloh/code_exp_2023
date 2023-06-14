import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';


const Taskbar = ({ activeButton, onPressButton }) => {
  const { logoutUser } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={activeButton === 'home' ? styles.activeButton : styles.button}
        onPress={() => {onPressButton('home'); navigation.navigate('Home')}}
      >
        <Ionicons name="home" size={24} color={activeButton === 'home' ? 'orange' : 'gray'} />
        <Text style={activeButton === 'home' ? styles.activeButtonText : styles.buttonText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={activeButton === 'create' ? styles.activeButton : styles.button}
        onPress={() => {onPressButton('create'); navigation.navigate('CreateFoodListing')}}
      >
        <Ionicons name="add" size={24} color={activeButton === 'create' ? 'orange' : 'gray'} />
        <Text style={activeButton === 'create' ? styles.activeButtonText : styles.buttonText}>Create</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={activeButton === 'listings' ? styles.activeButton : styles.button}
        onPress={() => {onPressButton('listings'); navigation.navigate('MyListingScreen')}}
      >
        <Ionicons name="menu" size={24} color={activeButton === 'listings' ? 'orange' : 'gray'} />
        <Text style={activeButton === 'listings' ? styles.activeButtonText : styles.buttonText}>My Listings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={activeButton === 'logout' ? styles.activeButton : styles.button}
        onPress={() => {onPressButton('logout'); logoutUser(); navigation.navigate('Landing');}} // redirect to landing after logout
      >
        <Ionicons name="log-out" size={24} color={activeButton === 'logout' ? 'orange' : 'gray'} />
        <Text style={activeButton === 'logout' ? styles.activeButtonText : styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 32,
  },
  button: {
    alignItems: 'center',
  },
  activeButton: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'orange',
  },
  buttonText: {
    fontSize: 12,
    color: 'gray',
  },
  activeButtonText: {
    fontSize: 12,
    color: 'orange',
  },
});

export default Taskbar;
