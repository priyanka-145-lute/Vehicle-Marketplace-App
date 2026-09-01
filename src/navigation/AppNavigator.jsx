import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';

import VehicleScreen from '../screens/VehicleScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
      />

      <Stack.Screen
        name="VehicleScreen"
        component={VehicleScreen}
      />

    </Stack.Navigator>
  );
};

const AppNavigator = () => {

  // Testing sathi true
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return isLoggedIn ? (
    <MainStack />
  ) : (
    <AuthStack setIsLoggedIn={setIsLoggedIn} />
  );
};

export default AppNavigator;