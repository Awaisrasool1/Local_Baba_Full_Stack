import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { saveToken} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Constants} from '../constants';
import Theme from '../theme/Theme';
import {useQueryClient} from '@tanstack/react-query';

interface CustomDrawerProps extends DrawerContentComponentProps {
  data: any;
  token: string | null;
  onLogout: () => Promise<void>;
}

const CustomDrawer: React.FC<CustomDrawerProps> = (props) => {
  const {data, token, onLogout, ...drawerProps} = props;
  const nav: any = useNavigation();
  const queryClient = useQueryClient();

  const handleLogOut = async () => {
    try {
      await AsyncStorage.clear();
      await saveToken(null, null, null);
      
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.setQueryData(['profile'], null);
      
      if (onLogout) {
        await onLogout();
      }
      
      nav.navigate(Constants.LOGIN_SCREEN);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...drawerProps}>
        {data && token && (
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
        )}
        <View style={style.magrinV5} />
        <DrawerItemList {...drawerProps} />
      </DrawerContentScrollView>
      {data && token && (
        <View style={style.logOutContainer}>
          <TouchableOpacity
            onPress={handleLogOut}
            style={{paddingVertical: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Theme.icons.logout} />
              <Text style={style.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
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