import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native';
import {Constants} from '../constants';
import {
  SplashScreen,
  LoginScreen,
  HomeScreen,
  LocationAccess,
  SeeAllRestaurant,
  SeeAllFood,
  FoodDetail,
  CartScreen,
  AddressScreen,
} from '../screens';
import SignUpScreen from '../screens/auth/signupScreen';
import DrawerNavigation from './DrawerNavigation';

const Stack = createNativeStackNavigator();

const AuthStackNavigation = () => {
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
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AuthStackNavigation;
