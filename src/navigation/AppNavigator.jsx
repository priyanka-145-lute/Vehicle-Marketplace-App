import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';
import {AccountLogoutContext} from '../screens/AccountScreens';

import VehicleScreen from '../screens/VehicleScreen';
import AllTwoWheelersScreen from '../screens/AllTwoWheelersScreen';
import AllFourWheelersScreen from '../screens/AllFourWheelersScreen';
import AllOtherVehiclesScreen from '../screens/AllOtherVehiclesScreen';
import TwoWheelerDetailScreen from '../screens/TwoWheelerDetailScreen';
import PartsScreen from '../screens/PartsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import {HelpSupportScreen, SavedSearchesScreen} from '../screens/PreferencesScreens';

const Stack = createNativeStackNavigator();
const SESSION_KEY = 'vehicle-login-session';

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

      <Stack.Screen
        name="Parts"
        component={PartsScreen}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />

      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />

      <Stack.Screen name="SavedSearches" component={SavedSearchesScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />

    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const {styles} = useThemeStyles(createStyles);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const updatingSession = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SESSION_KEY)
      .then(value => {if (active) {setIsLoggedIn(value === 'logged-in');}})
      .catch(() => {if (active) {Alert.alert('Session unavailable', 'Could not restore your login. Please sign in again.');}})
      .finally(() => {if (active) {setRestoring(false);}});
    return () => {active = false;};
  }, []);

  const updateSession = async loggedIn => {
    if (updatingSession.current) {return;}
    updatingSession.current = true;
    try {
      if (loggedIn) {
        await AsyncStorage.setItem(SESSION_KEY, 'logged-in');
      } else {
        await AsyncStorage.removeItem(SESSION_KEY);
      }
      setIsLoggedIn(loggedIn);
    } catch {
      Alert.alert(loggedIn ? 'Could not save login' : 'Could not log out', 'Please try again.');
    } finally {
      updatingSession.current = false;
    }
  };

  if (restoring) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#ef4444" accessibilityLabel="Restoring login" /></View>;
  }

  return isLoggedIn ? (
    <AccountLogoutContext.Provider value={() => updateSession(false)}>
      <MainStack />
    </AccountLogoutContext.Provider>
  ) : (
    <AuthStack setIsLoggedIn={updateSession} />
  );
};

export default AppNavigator;

const createStyles = colors => StyleSheet.create({
  loading: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface},
});
