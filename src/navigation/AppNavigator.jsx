import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';

import VehicleScreen from '../screens/VehicleScreen';
import AllTwoWheelersScreen from '../screens/AllTwoWheelersScreen';
import AllFourWheelersScreen from '../screens/AllFourWheelersScreen';
import AllOtherVehiclesScreen from '../screens/AllOtherVehiclesScreen';
import TwoWheelerDetailScreen from '../screens/TwoWheelerDetailScreen';

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

      <Stack.Screen
        name="AllTwoWheelers"
        component={AllTwoWheelersScreen}
      />

      <Stack.Screen
        name="AllFourWheelers"
        component={AllFourWheelersScreen}
      />

      <Stack.Screen
        name="AllOtherVehicles"
        component={AllOtherVehiclesScreen}
      />

      <Stack.Screen
        name="TwoWheelerDetail"
        component={TwoWheelerDetailScreen}
      />

      <Stack.Screen
        name="FourWheelerDetail"
        component={TwoWheelerDetailScreen}
      />

      <Stack.Screen
        name="OtherVehicleDetail"
        component={TwoWheelerDetailScreen}
      />

    </Stack.Navigator>
  );
};

const AppNavigator = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <MainStack />
  ) : (
    <AuthStack setIsLoggedIn={setIsLoggedIn} />
  );
};

export default AppNavigator;
