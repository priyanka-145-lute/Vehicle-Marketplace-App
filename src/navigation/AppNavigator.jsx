import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {api} from '../redux/api';
import {clearSession, restoreSession, saveSession, setSession} from '../redux/authSlice';
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


  const dispatch = useDispatch();
  const currentSession = useSelector(state => state.auth.session);
  const isLoggedIn = Boolean(currentSession);
  const [restoring, setRestoring] = useState(true);
  const updatingSession = useRef(false);

  useEffect(() => {
    let active = true;
    restoreSession(async body => {
      const request = dispatch(api.endpoints.refreshToken.initiate(body));
      try {return await request.unwrap();} finally {request.reset();}
    })
      .then(session => {if (active) {dispatch(setSession(session));}})
      .catch(() => {if (active) {Alert.alert('Session unavailable', 'Could not restore your login. Please sign in again.');}})
      .finally(() => {if (active) {setRestoring(false);}});
    return () => {active = false;};
  }, [dispatch]);

  const updateSession = async session => {
    if (updatingSession.current) {return;}
    updatingSession.current = true;
    try {
      if (session) {
        await saveSession(session);
      } else {
        let remoteFailed = false;
        if (currentSession?.refreshToken) {
          const request = dispatch(api.endpoints.logout.initiate({RefreshToken: currentSession.refreshToken}));
          try {
            const response = await request.unwrap();
            remoteFailed = response?.success === false;
          } catch {remoteFailed = true;} finally {request.reset();}
        }
        await clearSession();
        dispatch(setSession(null));
        dispatch(api.util.resetApiState());
        if (remoteFailed) {Alert.alert('Logged out on this device', 'Could not confirm logout with the server.');}
      }
      dispatch(setSession(session || null));
    } catch (error) {
      if (session) {throw error;}
      Alert.alert('Could not log out', 'Please try again.');
    } finally {
      updatingSession.current = false;
    }
  };

  if (restoring) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#ef4444" accessibilityLabel="Restoring login" /></View>;
  }

  return isLoggedIn ? (
    <AccountLogoutContext.Provider value={() => updateSession(null)}>
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
