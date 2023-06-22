import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Import your app logo image
import AppLogo from '../assets/app-logo.png';

const LoginScreen = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { loginUser } = authContext;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Username and password must not be empty');
      return;
    }
  
    try {
      await loginUser(username, password);
      setErrorMessage('');
      navigation.navigate('Home'); // Redirect to home screen
      return;
    } catch (error) {
      setErrorMessage('Username and/or password is incorrect');
    }
  };

  const navigateRegister = () => {
    navigation.navigate('Register');
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    setErrorMessage('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setErrorMessage('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={AppLogo} style={styles.logo} />

      <Text style={styles.title}>Log in</Text>
      <Text style={styles.label}>Username</Text>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />
      </View>
      <View style={styles.formGroup}>
       {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: 'white' }]}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={navigateRegister}>
        <Text style={[styles.buttonText, { color: 'orange' }]}>Not a user yet? Register Here.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    alignSelf: 'center',
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
    marginVertical: 5
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

export default LoginScreen;
