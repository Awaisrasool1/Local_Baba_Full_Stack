import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {StyleSheet, View, Text, Image} from 'react-native';
import {Constants} from '../constants';
import {
  HomeScreen,
  SeeAllRestaurant,
  SeeAllFood,
  FoodDetail,
  CartScreen,
  AddressScreen,
} from '../screens';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={{uri: 'https://via.placeholder.com/100'}}
          style={styles.profilePicture}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john@example.com</Text>
        </View>
      </View>
      <DrawerItemList
        {...props}
        items={[
          {key: 'home', name: 'Home', icon: 'home'},
          {key: 'cart', name: 'Cart', icon: 'shopping-cart'},
          {key: 'settings', name: 'Settings', icon: 'cog'},
        ]}
        itemStyle={({focused}: any) => [
          styles.drawerItem,
          focused ? styles.activeDrawerItem : null,
        ]}
        labelStyle={({focused}: any) => [
          styles.drawerItemLabel,
          focused ? styles.activeDrawerItemLabel : null,
        ]}
        iconStyle={{marginRight: 16}}
        icon={({name, color, size}: any) => <Image />}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
      <Drawer.Navigator
        drawerContent={(props: any) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#242B47',
          drawerInactiveBackgroundColor: 'white',
          headerShown: false,
        }}>
        {/* <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Cart" component={CartScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{drawerItemList: false}}
        /> */}
        <Drawer.Screen
          name={Constants.HOME_SCREEN}
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name={Constants.SEE_ALL_RESTAURANT}
          component={SeeAllRestaurant}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name={Constants.SEE_ALL_FOOD}
          component={SeeAllFood}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name={Constants.FOOD_DETAIL}
          component={FoodDetail}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name={Constants.CART_SCREEN}
          component={CartScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name={Constants.ADDRESS_SCREEN}
          component={AddressScreen}
          options={{headerShown: false}}
        />
      </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerHeader: {
    height: 150,
    backgroundColor: '#242B47',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profilePicture: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: 'white',
    fontSize: 14,
  },
  drawerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeDrawerItem: {
    backgroundColor: '#242B47',
  },
  drawerItemLabel: {
    color: 'black',
    fontSize: 16,
  },
  activeDrawerItemLabel: {
    color: 'white',
  },
});

export default DrawerNavigation;
