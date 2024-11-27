import React from 'react';
import {View, Text, Image, ScrollView, SafeAreaView} from 'react-native';
import {CommonActions, useIsFocused, useNavigation} from '@react-navigation/native';
import styles from './styles';
import Theme from '../../../theme/Theme';
import {Header, ProfileCard} from '../../../components';
import {Constants} from '../../../constants';
import {useQuery} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../api';
import {useToast} from 'react-native-toasty-toast';
import {get_profile} from '../../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveToken} from '../../../api/api';

const SettingScreen = (props: any) => {
  const navigation: any = useNavigation();
  const {showToast} = useToast();
  const isFocused = useIsFocused();
  
  const menuItems = [
    {
      id: Constants.PROFILE_SCREEN,
      title: 'Personal Info',
      icon: Theme.icons.profile,
      section: 1,
    },
    {
      id: Constants.SEE_ALL_ADDRESS,
      title: 'Addresses',
      icon: Theme.icons.address,
      section: 1,
    },
    {
      id: Constants.CART_SCREEN,
      title: 'Cart',
      icon: Theme.icons.profileCart,
      section: 2,
    },
    {
      id: Constants.NOTIFICATION_SCREEN,
      title: 'Notifications',
      icon: Theme.icons.notification,
      section: 2,
    },
    {
      id: Constants.ORDER_TOP_TAB,
      title: 'My Orders',
      icon: Theme.icons.order_number,
      section: 3,
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: Theme.icons.logout,
      section: 3,
    },
  ];

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
    enabled:isFocused
  });

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      saveToken(null, null, null);
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: Constants.LOGIN_SCREEN}],
        }),
      );
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
      navigation.navigate(item.id, {data: data});
      return;
    }

    navigation.navigate(item.id);
  };

  const renderSection = (sectionNumber: number) => {
    const sectionItems = menuItems.filter(
      item => item.section === sectionNumber,
    );
    return (
      <View style={styles.section}>
        {sectionItems.map((item: any, index: number) => (
          <ProfileCard
            key={index}
            title={item.title}
            icon={item.icon}
            onPress={() => handleNavigation(item)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingH10}>
        <Header
          isBack
          isBackTitle="Profile"
          onlyBack
          onBack={() => navigation.goBack()}
        />
      </View>
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
        {renderSection(1)}
        {renderSection(2)}
        {renderSection(3)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
