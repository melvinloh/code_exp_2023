import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

const HomeButtonLong = () => {
    const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => {navigation.navigate('Home')}} style={styles.container}>
      <Image source={require("../assets/home-long-icon.png")} style={styles.icon} />
      <Text style={styles.text}>Home</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    text: {
      fontSize: 16,
      color: "orange",
      fontWeight: "bold"
    },
  });

export default HomeButtonLong;
