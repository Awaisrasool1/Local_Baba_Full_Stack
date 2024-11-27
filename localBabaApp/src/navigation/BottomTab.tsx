import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';
import Theme from '../theme/Theme';
import React from 'react';
import {Constants} from '../constants';
import {
  RiderHome,
  RiderLocationScreen,
  RiderNotificationScreen,
  RiderProfileScreen,
} from '../screens';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={Constants.RIDER_HOME_SCREEN}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconSource;

          if (route.name === Constants.RIDER_HOME_SCREEN) {
            iconSource = focused ? Theme.icons.riderActive1 : Theme.icons.rider1;
          } else if (route.name === Constants.RIDER_LOCATION_SCREEN) {
            iconSource = focused
              ? Theme.icons.riderActive2
              : Theme.icons.rider2;
          } else if (route.name === Constants.RIDER_NOTIFICATION_SCREEN) {
            iconSource = focused ? Theme.icons.riderActive3 : Theme.icons.rider3;
          } else if (route.name === Constants.RIDER_PROFILE_SCREEN) {
            iconSource = focused ? Theme.icons.riderActive4 : Theme.icons.rider4;
          }

          return (
            <Image
              source={iconSource}
              style={{
                tintColor: color,
                width: Theme.responsiveSize.size16,
                height: Theme.responsiveSize.size16,
                position: 'absolute',
                top: 20,
              }}
            />
          );
        },
        tabBarLabel: ({focused}) => {
          // let label;
          // if (route.name === Constants.RIDER_HOME_SCREEN) {
          //   label = 'Home';
          // } else if (route.name === Constants.RIDER_LOCATION_SCREEN) {
          //   label = 'Cart';
          // } else if (route.name === Constants.RIDER_NOTIFICATION_SCREEN) {
          //   label = 'Setting';
          // } else if (route.name === Constants.RIDER_PROFILE_SCREEN) {
          //   label = 'Profile';
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
        name={Constants.RIDER_HOME_SCREEN}
        component={RiderHome}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={Constants.RIDER_LOCATION_SCREEN}
        component={RiderLocationScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={Constants.RIDER_NOTIFICATION_SCREEN}
        component={RiderNotificationScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={Constants.RIDER_PROFILE_SCREEN}
        component={RiderProfileScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
