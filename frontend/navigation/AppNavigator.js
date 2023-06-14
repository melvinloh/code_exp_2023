import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import HomeScreen from "../screens/drawerScreens/HomeScreen";
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CreateFoodListing from "../screens/CreateFoodListing";
import MyListingScreen from "../screens/MyListingsScreen";
import FoodDetailScreen from "../screens/FoodDetailScreen";
import CategoryListingScreen from "../screens/CategoryListingScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = (props) => {

    return (
        <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}} />
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="CreateFoodListing" component={CreateFoodListing} options={{headerShown: false}} />
            <Stack.Screen name="MyListingScreen" component={MyListingScreen} options={{headerShown: false}} />
            <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} options={{headerShown: false}} />
            <Stack.Screen name="CategoryListingScreen" component={CategoryListingScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

export default AppNavigator;