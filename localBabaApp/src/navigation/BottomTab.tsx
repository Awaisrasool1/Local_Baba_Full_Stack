import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';
import Theme from '../theme/Theme';
import React from 'react';
import { Constants } from '../constants';
import { CartScreen, HomeScreen, SettingScreen } from '../screens';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={Constants.HOME_SCREEN}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconSource;

          if (route.name === Constants.HOME_SCREEN) {
            iconSource = focused ? Theme.icons.home : Theme.icons.home;
          } else if (route.name === Constants.CART_SCREEN) {
            iconSource = focused
              ? Theme.icons.addToCart
              : Theme.icons.addToCart;
          } else if (route.name === Constants.SETTING_SCREEN) {
            iconSource = focused
              ? Theme.icons.setting
              : Theme.icons.setting;
          }
          // else if (route.name === ScreenConstants.MyProfileScreen) {
          //   iconSource = focused
          //     ? Theme.icons.profile_active
          //     : Theme.icons.profile;
          // } else if (route.name === ScreenConstants.MyMessagesScreen) {
          //   iconSource = focused ? Theme.icons.messages : Theme.icons.messages;
          // }

          return (
            <Image
              source={iconSource}
              style={{
                tintColor: color,
                width: Theme.responsiveSize.size16,
                height: Theme.responsiveSize.size16,
                position: 'absolute',
                top: 10,
              }}
            />
          );
        },
        tabBarLabel: ({focused}) => {
          let label;
          if (route.name === Constants.HOME_SCREEN) {
            label = 'Home';
          } else if (route.name === Constants.CART_SCREEN) {
            label = 'Cart';
          } else if (route.name === Constants.SETTING_SCREEN) {
            label = 'Setting';
          } 
          // else if (route.name === ScreenConstants.MyProfileScreen) {
          //   label = 'Profile';
          // } else if (route.name === ScreenConstants.MyMessagesScreen) {
          //   label = 'Inbox';
          // }

          return (
            <Text
              style={{
                color: focused ? Theme.colors.appColor : Theme.colors.disabled,
                fontSize: Theme.responsiveSize.size10,
                fontWeight: focused ? 'bold' : 'normal',
                position: 'absolute',
                bottom: 5,
              }}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: Theme.colors.appColor,
        tabBarInactiveTintColor: Theme.colors.disabled,
        tabBarItemStyle: {
          height: Theme.responsiveSize.size45,
        },
        tabBarStyle: {
          height: Theme.responsiveSize.size50,
          // paddingBottom: Theme.responsiveSize.size5,
        },
      })}>
      <Tab.Screen
        name={Constants.HOME_SCREEN}
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={Constants.CART_SCREEN}
        component={CartScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={Constants.SETTING_SCREEN}
        component={SettingScreen}
        options={{headerShown: false}}
      />
      
    </Tab.Navigator>
  );
}
