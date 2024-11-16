import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import {Image} from 'react-native';
import {Constants} from '../constants';
import {CartScreen, HomeScreen, LoginScreen, SettingScreen} from '../screens';
import Theme from '../theme/Theme';
import {getToken, isNetworkAvailable} from '../api/api';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {get_profile} from '../services';
import {useToast} from 'react-native-toasty-toast';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  const {showToast} = useToast();
  const [token, setToken] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const {data, refetch} = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return null;
        }
        const res = await get_profile();
        return res.data;
      } catch (err: any) {
        console.log(err.response?.data?.message || 'Error occurred');
        showToast(
          err.response?.data?.message || 'Error occurred',
          'error',
          'bottom',
          1000,
        );
        return null;
      }
    },
    enabled: false,
  });

  const checkTokenAndFetchProfile = async () => {
    try {
      const savedToken = await getToken();
      setToken(savedToken);

      if (savedToken) {
        refetch();
      } else {
        queryClient.removeQueries({queryKey: ['profile']});
        queryClient.setQueryData(['profile'], null);
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkTokenAndFetchProfile();
    }, []),
  );

  return (
    <Drawer.Navigator
      initialRouteName={Constants.HOME_SCREEN}
      drawerContent={props => (
        <CustomDrawer
          {...props}
          data={data}
          token={token}
          onLogout={checkTokenAndFetchProfile}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Theme.colors.bgColor18,
        drawerActiveTintColor: Theme.colors.appColor,
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
          drawerIcon: ({color}) => <Image source={Theme.icons.home} />,
        }}
      />
      <Drawer.Screen
        name={token ? Constants.CART_SCREEN : Constants.LOGIN_SCREEN}
        component={token ? CartScreen : LoginScreen}
        options={{
          drawerLabel: 'Cart',
          headerTitleAlign: 'center',
          headerTitle: 'Friends',
          drawerIcon: ({color}) => <Image source={Theme.icons.addToCart} />,
        }}
      />
      <Drawer.Screen
        name={Constants.SETTING_SCREEN}
        component={SettingScreen}
        options={{
          drawerLabel: 'Setting',
          headerTitleAlign: 'center',
          headerTitle: 'Profile',
          drawerIcon: ({color}) => <Image source={Theme.icons.setting} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
