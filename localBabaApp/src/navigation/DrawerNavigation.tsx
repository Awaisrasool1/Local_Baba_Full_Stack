import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import {Image} from 'react-native';
import {Constants} from '../constants';
import {CartScreen, HomeScreen, SettingScreen} from '../screens';
import Theme from '../theme/Theme';

const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName={Constants.HOME_SCREEN}
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Theme.colors.bgColor18,
        drawerActiveTintColor:  Theme.colors.appColor,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name={Constants.HOME_SCREEN}
        component={HomeScreen}
        options={{
          drawerLabel: 'Home',
          headerTitleAlign: 'center',
          headerTitle: 'Home',
          drawerIcon: ({color}) => (
            <Image source={Theme.icons.home}  />
          ),
        }}
      />
      <Drawer.Screen
        name={Constants.CART_SCREEN}
        component={CartScreen}
        options={{
          drawerLabel: 'Cart',
          headerTitleAlign: 'center',
          headerTitle: 'Friends',
          drawerIcon: ({color}) => (
            <Image source={Theme.icons.addToCart} />
          ),
        }}
      />
      <Drawer.Screen
        name={Constants.SETTING_SCREEN}
        component={SettingScreen}
        options={{
          drawerLabel: 'Setting',
          headerTitleAlign: 'center',
          headerTitle: 'Profile',
          drawerIcon: ({color}) => (
            <Image source={Theme.icons.setting}/>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
export default MyDrawer;
