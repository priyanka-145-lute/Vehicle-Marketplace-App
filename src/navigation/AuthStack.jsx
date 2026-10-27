import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/authScreen/LoginScreen';
import OtpScreen from '../screens/authScreen/OtpScreen';
import SplashScreen from '../screens/authScreen/SplashScreen';
import OnboardingScreen from '../screens/authScreen/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AuthStack = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />

      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Otp">
        {props => <OtpScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default AuthStack;
