import {View, Text, SafeAreaView, ScrollView, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import {Constants} from '../../../constants';
import Theme from '../../../theme/Theme';
import {ProfileCard} from '../../../components';
import {isNetworkAvailable, saveToken} from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toasty-toast';
import {useQuery} from '@tanstack/react-query';
import {get_completed_order_count, get_profile} from '../../../services';
import {useIsFocused} from '@react-navigation/native';

const RiderProfileScreen = (props: any) => {
  const {showToast} = useToast();
  const isFocused = useIsFocused();

  const menuItems = [
    {
      id: Constants.RIDER_PROFILE_INFO_SCREEN,
      title: 'Personal Info',
      icon: Theme.icons.profile,
    },
    {
      title: 'Number of Orders',
      icon: Theme.icons.order_number,
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: Theme.icons.logout,
    },
  ];

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      saveToken(null, null, null);
      props.navigation.reset({
        index: 0,
        routes: [{name: Constants.LOGIN_SCREEN}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      showToast('Error during logout', 'error', 'bottom', 1000);
    }
  };

  const handleNavigation = (item: any) => {
    if (item.title === 'Log Out') {
      logOut();
      return;
    }

    if (item.title === 'Personal Info') {
      props.navigation.navigate(item.id, {data: data});
      return;
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
        console.log(err.response?.data?.message || 'Error fetching profile');
        showToast(
          err.response?.data?.message || 'Error fetching profile',
          'error',
          'bottom',
          1000,
        );
        return null;
      }
    },
    enabled: isFocused,
  });

  const {data: completedOrderCount} = useQuery({
    queryKey: ['completedOrderCount'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return;
        }
        const res = await get_completed_order_count();
        if (res.status == 'success') {
          return res.totalOrders;
        } else {
          return null;
        }
      } catch (err: any) {
        console.log(err.response.data.message);
        showToast(err.response.data.message, 'error', 'bottom', 1000);
      }
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingH10}></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: data?.image || 'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>{data?.name}</Text>
            <Text style={styles.email}>{data?.email}</Text>
          </View>
        </View>
        <View style={styles.section}>
          {menuItems.map((item: any, index: number) => (
            <ProfileCard
              key={index}
              title={item.title}
              icon={item.icon}
              isDisable={index == 1}
              type="rider"
              orderNumber={completedOrderCount}
              index={index}
              onPress={() => handleNavigation(item)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RiderProfileScreen;
