import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Constants} from '../constants';
import {
  SplashScreen,
  LoginScreen,
  LocationAccess,
  SeeAllRestaurant,
  SeeAllFood,
  FoodDetail,
  AddressScreen,
  SeeAllAddress,
  Notification,
  ProfileScreen,
  HomeScreen,
  CartScreen,
  SettingScreen,
  TrackOrder,
  OrderSuccess,
  OrderDetails,
  RiderProInfo,
  OrderRequests,
  OrderLocationScreen,
} from '../screens';
import SignUpScreen from '../screens/auth/signupScreen';
import DrawerNavigation from './DrawerNavigation';
import OrderTopTab from './OrderTopTab';
import {SafeAreaView} from 'react-native';
import {getRole} from '../api/api';
import {BottomTabs} from './BottomTab';
import {useFocusEffect} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName={Constants.SPLASH_SCREEN}
        screenOptions={({navigation, route}) => ({})}>
        <Stack.Screen
          name={Constants.SPLASH_SCREEN}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SIGNUP_SCREEN}
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.LOGIN_SCREEN}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.LOCATION_ACCESS_SCREEN}
          component={LocationAccess}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.DRAWER_NAVIGATION}
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SEE_ALL_RESTAURANT}
          component={SeeAllRestaurant}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SEE_ALL_FOOD}
          component={SeeAllFood}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.ADDRESS_SCREEN}
          component={AddressScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.FOOD_DETAIL}
          component={FoodDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SEE_ALL_ADDRESS}
          component={SeeAllAddress}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.NOTIFICATION_SCREEN}
          component={Notification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.PROFILE_SCREEN}
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.HOME_SCREEN}
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.CART_SCREEN}
          component={CartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SETTING_SCREEN}
          component={SettingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.ORDER_TOP_TAB}
          component={OrderTopTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.TRACK_ORDER}
          component={TrackOrder}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.ORDER_SUCCESS}
          component={OrderSuccess}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.ORDER_DETAILS}
          component={OrderDetails}
          options={{headerShown: false}}
        />
        {/* rider */}
        <Stack.Screen
          name={Constants.RIDER_BOTTOM_TAB}
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.RIDER_PROFILE_INFO_SCREEN}
          component={RiderProInfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.ORDER_REQUEST_SCREEN}
          component={OrderRequests}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.ORDER_LOCATION_SCREEN}
          component={OrderLocationScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
