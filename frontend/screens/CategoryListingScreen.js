import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { View, Text, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import Card from "../components/CardSection/Card";
import axios from "axios";
import EmptyListings from "../modules/EmptyListings";


const ItemSeparator = () => {
  return <View style={styles.separator} />;
};

const CategoryListingScreen = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { domain, userId, username, isLoggedIn } = authContext;
  const [categorizedListings, setCategorizedListings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Best Match");

  useEffect(() => {
    fetchCategorizedListings();
  }, [activeFilter]);

  const fetchCategorizedListings = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('category', category);
      formData.append('filter', activeFilter);

      const response = await axios.post(`${domain}/api/category-listings/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCategorizedListings(response.data);
    } catch (error) {
      console.log('Error fetching categorized listings:', error);
    }
  };

  const handleCardPress = (id) => {
    navigation.navigate('FoodDetailScreen', { id });
  };


  const renderCard = ({ item }) => (
    <Card
      key={item.id}
      food_image_url={item.food_image_url}
      title={item.title}
      category={item.description} // we change this to description instead
      onPress={() => handleCardPress(item.id)}
    />
  );

  // filter stuff
  const filterOptions = [
    "Best Match",
    "Expiring",
    "Price - Low to High",
    "Price - High to Low",
    "Region: Downtown",
    "Region: East",
    "Region: West",
    "Region: North",
  ];

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
  };

  if (categorizedListings.length === 0) {
    return (
      <EmptyListings 
        description={'No listings available for this category'}
        handleButtonPress={() => {navigation.navigate('Home')}}
        buttonText={'Go back and explore'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
        <Text style={styles.title}>{category}</Text>
      </View>

      <View style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter ? styles.activeFilterButton : styles.inactiveFilterButton,
            ]}
            onPress={() => handleFilterPress(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === filter ? styles.activeFilterButtonText : styles.inactiveFilterButtonText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={categorizedListings}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.cardContainer}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false} // Add this line

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  cardContainer: {
    justifyContent: 'center',
    paddingLeft: 10, // add this to do mannual adjustments
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  separator: {
    height: 20, // Adjust the desired spacing between cards
    backgroundColor: 'transparent',
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
  },
  filterButton: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 3,
    marginHorizontal: 6,
  },
  activeFilterButton: {
    borderColor: "orange",
  },
  inactiveFilterButton: {
    borderColor: "gray",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },
  activeFilterButtonText: {
    color: "orange",
  },
  inactiveFilterButtonText: {
    color: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default CategoryListingScreen;
