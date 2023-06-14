import React from "react";
import { View, TouchableOpacity, Linking, Image, Text, StyleSheet } from "react-native";

const WhatsAppButton = ({ phoneNumber }) => {
  const handleWhatsAppPress = () => {
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          console.log("WhatsApp is not installed on this device");
        }
      })
      .catch((error) => console.log("Error opening WhatsApp:", error));
  };

  return (
    <TouchableOpacity onPress={handleWhatsAppPress} style={styles.container}>
      <Image source={require("../assets/whatsapp-icon.png")} style={styles.icon} />
      <Text style={styles.text}>Chat with Seller</Text>
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
    color: "green",
    fontWeight: "bold"
  },
});

export default WhatsAppButton;
