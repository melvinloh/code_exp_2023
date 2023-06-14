import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SplashScreen from "./SplashScreen";
import HomeScreen from "./drawerScreens/HomeScreen";
import LoginScreen from "./LoginScreen";

const LandingScreen = () => {
  const authContext = useContext(AuthContext);
  const { isLoggedIn, logoutUser } = authContext;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 500); // Delay of 0.5 seconds (500 milliseconds)

    return () => {
      clearTimeout(timer); // Clear the timeout if the component unmounts before the delay finishes
    };
  }, []);


  if (showSplash) {
    return <SplashScreen />;
  } else if (isLoggedIn) {
    // User is logged in, show main content
    return <HomeScreen />
  } else {
    // User is not logged in, show login screen
    return <LoginScreen />;
  }
};

export default LandingScreen;
