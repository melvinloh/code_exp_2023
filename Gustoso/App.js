import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import { FoodContext, FoodContextProvider } from './contexts/FoodContext';

import { LogBox } from 'react-native';

// Ignore all logs
LogBox.ignoreAllLogs();

export default function App() {

  return (
    <AuthContextProvider>
      <FoodContextProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </FoodContextProvider>
    </AuthContextProvider>
  );
}
