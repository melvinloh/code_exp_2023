import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Import your app logo image
import AppLogo from '../assets/app-logo.png';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { registerUser } = authContext;

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!isFormValid()) {
      setErrorMessage('All fields must be valid and passwords must match');
      return;
    }

    try {
      await registerUser(email, username, password, phoneNumber);
      setErrorMessage('');
      navigation.navigate('Home'); // Redirect to home screen
      return;
    } catch (error) {
      setErrorMessage('Username/email account taken.');
    }
  };

  const navigateLogin = () => {
    navigation.navigate('Login');
  };

  const isFormValid = () => {
    return validateEmail(email) && password === confirmPassword && phoneNumber !== '';
  };

  const validateEmail = (email) => {
    return email.includes('@');
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={AppLogo} style={styles.logo} />

      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.label}>Username</Text>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            clearErrorMessage();
          }}
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.label}>Email</Text>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearErrorMessage();
          }}
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor="gray"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            clearErrorMessage();
          }}
          keyboardType="phone-pad"
        />
      </View>
      <Text style={styles.label}>Password</Text>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearErrorMessage();
          }}
          secureTextEntry
        />
      </View>
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            clearErrorMessage();
          }}
          secureTextEntry
        />
      </View>
      <View style={styles.formGroup}>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={handleRegister}>
        <Text style={[styles.buttonText, { color: 'white' }]}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={navigateLogin}>
        <Text style={[styles.buttonText, { color: 'orange' }]}>Already have an account? Login Here.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingHorizontal: 10,
  },
  label: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RegisterScreen;
