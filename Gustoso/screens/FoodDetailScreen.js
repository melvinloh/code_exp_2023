import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import WhatsAppButton from '../modules/WhatsappButton';
import HomeButtonLong from '../modules/HomeButtonLong';

const FoodDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [foodDetails, setFoodDetails] = useState(null);
  const { domain, userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`${domain}/api/food/${id}`);
        setFoodDetails(response.data);
      } catch (error) {
        console.log('Error fetching food details:', error);
      }
    };

    fetchFoodDetails();
  }, []);

  if (!foodDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size={80} color="orange" />
      </View>
    );
  }

  const { lister_contact_number, user, category, description, expiration_date, food_image_url, pickup_location, price, title } = foodDetails;

  return (
    <View style={styles.container}>
      <Image source={{ uri: `${food_image_url}` }} style={styles.image} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView contentContainerStyle={styles.scrollviewcontainer} showsVerticalScrollIndicator={false}>
        <View style={styles.detailRow}>
          <Feather name="dollar-sign" size={20} style={styles.icon}/>
          <Text style={styles.price}>{price}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="user" size={20} style={styles.icon}/>
          <Text style={styles.detailText}><Text style={styles.boldText}>Listed by:</Text> {user}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="clock" size={20} style={styles.icon}/>
          <Text style={styles.detailText}><Text style={styles.boldText}>Expiration Date:</Text> {expiration_date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="tag" size={20} style={styles.icon}/>
          <Text style={styles.detailText}>{category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="map-pin" size={20} style={styles.icon}/>
          <Text style={styles.detailText}><Text style={styles.boldText}>Pickup at:</Text> {pickup_location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="file-text" size={20} style={styles.icon}/>
          <Text style={styles.description}>{description}</Text>
        </View>

        </ScrollView>
      </View>


      <View style={styles.bottomButtonscontainer}>
            <HomeButtonLong />
            <View style={styles.spacing} />
            <WhatsAppButton phoneNumber={`65${lister_contact_number.toString()}`} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  scrollviewcontainer: {
    flexGrow: 1,
    paddingVertical: 5,
    paddingRight: 25,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomButtonscontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    },
  spacing: {
      width: 10, // Adjust the spacing width as needed
  },
  boldText: {
      fontWeight: 'bold',  
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  icon: {
    marginTop: 5,
    color: "orange",
  },
  detailText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'orange',
  },
  description: {
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FoodDetailScreen;
