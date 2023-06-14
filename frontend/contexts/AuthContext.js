import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [domain, setDomain] = useState("http://192.168.1.10:8000")

  useEffect(() => {
    // Check if there are stored tokens in SecureStore
    const checkStoredTokens = async () => {
      try {
        const storedTokens = await SecureStore.getItemAsync("authTokens");
        if (storedTokens) {
          setAuthTokens(storedTokens);
          // set user id and user name (django)
          console.log(jwt_decode(authTokens));
          const newUserId = jwt_decode(authTokens).user_id.toString();
          const newUsername = jwt_decode(authTokens).username;
          setUserId(newUserId);
          setUsername(newUsername);
          setIsLoggedIn(true);
          
        }
      } catch (error) {
        console.log("Error retrieving stored tokens:", error);
      }
    };

    checkStoredTokens();
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${domain}/user/token/`, {
        username,
        password,
      });

      const tokens = {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      };

      setAuthTokens(tokens);
      // set user id (django)
      const newUserId = jwt_decode(tokens.accessToken).user_id.toString();
      const newUsername = jwt_decode(tokens.accessToken).username;
      setUserId(newUserId);
      setUsername(newUsername);
      // end
      setIsLoggedIn(true);
      storeTokens(tokens);
      


      return;
    } catch (error) {
        throw new Error("Error with login");
    }
  };

  const registerUser = async (email, username, password, phoneNumber) => {
    try {
      const response = await axios.post(`${domain}/user/register/`, {
        email,
        username,
        password,
        phoneNumber,
      });
  
      // Optionally, you can log in the user after successful registration
      if (response.status === 201) {
        await loginUser(username, password); // Wait for loginUser to complete
        return true; // Registration and login successful
      } else {
        throw new Error("Error with registration");
      }
    } catch (error) {
      throw new Error("Error with registration");
    }
  };

  const logoutUser = () => {
    // Clear tokens and set logged in state to false
    setAuthTokens(null);
    setIsLoggedIn(false);
    removeTokens();
  };

  const storeTokens = async (tokens) => {
    try {
      await SecureStore.setItemAsync("authTokens", JSON.stringify(tokens));
    } catch (error) {
      console.log("Error storing tokens:", error);
    }
  };

  const removeTokens = async () => {
    try {
      await SecureStore.deleteItemAsync("authTokens");
    } catch (error) {
      console.log("Error removing tokens:", error);
    }
  };

  const authContext = {
    domain,
    isLoggedIn,
    userId,
    username,
    loginUser,
    registerUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

