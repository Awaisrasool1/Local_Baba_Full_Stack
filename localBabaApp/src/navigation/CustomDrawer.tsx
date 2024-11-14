import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {isNetworkAvailable} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Constants} from '../constants';
import Theme from '../theme/Theme';

const CustomDrawer = (props: any) => {
  const nav: any = useNavigation();

  const logOut = async () => {
    AsyncStorage.clear();
    nav.reset({
      index: 0,
      routes: [
        {
          name: Constants.LOGIN_SCREEN,
        },
      ],
    });
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={style.drawerHeader}>
          <Image
            source={{uri: 'https://via.placeholder.com/100'}}
            style={style.profilePicture}
          />
          <View style={style.profileInfo}>
            <Text style={style.profileName}>John Doe</Text>
            <Text style={style.profileEmail}>john@example.com</Text>
          </View>
        </View>
        <View style={style.magrinV5} />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={style.logOutContainer}>
        <TouchableOpacity
          onPress={() => logOut()}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Image source={require('../assest/Img/logout.png')} /> */}
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
