import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Octicons';

import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import MySalesScreen from '../screens/MySalesScreen';
import MessageScreen from '../screens/MessageScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({

        headerShown: false,

        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: '#111',

        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginBottom: 4,
        },

        tabBarIcon: ({focused, color}) => {

          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          }

          else if (route.name === 'Wishlist') {
            iconName = 'heart';
          }

          else if (route.name === 'My Sales') {
            iconName = 'stack';
          }

          else if (route.name === 'Messages') {
            iconName = 'comment-discussion';
          }

          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? 'red' : '#111'}
            />
          );
        },
      })}>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
      />

      <Tab.Screen
        name="My Sales"
        component={MySalesScreen}
      />

      <Tab.Screen
        name="Messages"
        component={MessageScreen}
      />

    </Tab.Navigator>
  );
};

export default BottomTabs;