import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/authScreen/LoginScreen';
import SplashScreen from '../screens/authScreen/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthStack = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
      />

      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen 
            {...props} 
            setIsLoggedIn={setIsLoggedIn} 
          />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default AuthStack;