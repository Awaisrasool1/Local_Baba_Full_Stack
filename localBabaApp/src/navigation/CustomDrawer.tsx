import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {isNetworkAvailable, saveToken} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Constants} from '../constants';
import Theme from '../theme/Theme';
import {useQuery} from '@tanstack/react-query';
import {get_profile} from '../services';
import { useToast } from 'react-native-toasty-toast';

const CustomDrawer = (props: any) => {
  const {...drawerProps} = props;
  const nav: any = useNavigation();
  const isFocused = useIsFocused();
  const {showToast} = useToast();

  const handleLogOut = async () => {
    debugger
    try {
      await AsyncStorage.clear();
      await saveToken(null, null, null);
      nav.reset({
        index: 0,
        routes: [{name: Constants.LOGIN_SCREEN}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const {data} = useQuery({
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
    enabled: isFocused,
  });
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...drawerProps}>
        <View style={style.drawerHeader}>
          <Image
            source={{
              uri: data?.image || 'https://via.placeholder.com/100',
            }}
            style={style.profilePicture}
          />
          <View style={style.profileInfo}>
            <Text style={style.profileName}>{data?.name}</Text>
            <Text style={style.profileEmail}>{data?.email}</Text>
          </View>
        </View>
        <View style={style.magrinV5} />
        <DrawerItemList {...drawerProps} />
      </DrawerContentScrollView>
      <View style={style.logOutContainer}>
        <TouchableOpacity onPress={handleLogOut} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={Theme.icons.logout} />
            <Text style={style.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  logoutText: {
    fontSize: Theme.responsiveSize.size13,
    marginLeft: Theme.responsiveSize.size10,
  },
  logOutContainer: {
    padding: Theme.responsiveSize.size15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  drawerHeader: {
    height: Theme.responsiveSize.size100,
    flexDirection: 'row',
    paddingHorizontal: Theme.responsiveSize.size10,
    alignItems: 'center',
  },
  profilePicture: {
    width: Theme.responsiveSize.size60,
    height: Theme.responsiveSize.size60,
    borderRadius: Theme.responsiveSize.size30,
  },
  profileInfo: {
    marginLeft: Theme.responsiveSize.size10,
  },
  profileName: {
    color: Theme.colors.black,
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: Theme.colors.black,
    fontSize: Theme.responsiveSize.size14,
  },
  magrinV5: {
    marginVertical: Theme.responsiveSize.size10,
  },
});

export default CustomDrawer;
