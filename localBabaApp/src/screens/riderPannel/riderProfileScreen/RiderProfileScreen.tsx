import {View, Text, SafeAreaView, ScrollView, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import {Constants} from '../../../constants';
import Theme from '../../../theme/Theme';
import {ProfileCard} from '../../../components';
import {saveToken} from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toasty-toast';

const RiderProfileScreen = (props: any) => {
  const {showToast} = useToast();
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
      props.navigation.navigate(item.id, {data: null});
      return;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingH10}>
        {/* <Header
        isBack
        isBackTitle="Profile"
        onlyBack
        onBack={() => navigation.goBack()}
      /> */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>'dadsa</Text>
            <Text style={styles.email}>asdas</Text>
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
              orderNumber={100}
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
