import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileButton = ({ username }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} disabled>
      <View style={styles.iconContainer}>
        <Ionicons name="md-person" size={20} color="white" />
      </View>
      <Text style={styles.buttonText}>{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileButton;
