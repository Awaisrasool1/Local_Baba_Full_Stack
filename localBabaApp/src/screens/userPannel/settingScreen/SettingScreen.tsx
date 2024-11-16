import React from 'react';
import {View, Text, Image, ScrollView, SafeAreaView} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import styles from './styles';
import Theme from '../../../theme/Theme';
import {CustomButton, Header, ProfileCard} from '../../../components';
import {Constants} from '../../../constants';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../api';
import {useToast} from 'react-native-toasty-toast';
import {get_profile} from '../../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken, saveToken} from '../../../api/api';

const SettingScreen = (props: any) => {
  const navigation: any = useNavigation();
  const {showToast} = useToast();
  const [token, setToken] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

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
      id: 'review',
      title: 'To Review',
      icon: 'star-outline',
      section: 3,
    },
    ...(token
      ? [
          {
            id: 'logout',
            title: 'Log Out',
            icon: Theme.icons.logout,
            section: 3,
          },
        ]
      : []),
  ];

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
        console.log(err.response?.data?.message || 'Error fetching profile');
        showToast(err.response?.data?.message || 'Error fetching profile', 'error', 'bottom', 1000);
        return null;
      }
    },
    enabled: false,
  });

  const clearProfileData = () => {
    queryClient.removeQueries({ queryKey: ['profile'] });
    queryClient.setQueryData(['profile'], null);
  };

  const checkTokenAndFetchProfile = async () => {
    try {
      const savedToken = await getToken();
      setToken(savedToken);
      
      if (savedToken) {
        refetch();
      } else {
        clearProfileData();
      }
    } catch (error) {
      console.error('Error checking token:', error);
      showToast('Error checking authentication status', 'error', 'bottom', 1000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkTokenAndFetchProfile();
    }, [])
  );

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      clearProfileData();
      saveToken(null,null,null);
      setToken(null)

      // props.navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{name: Constants.LOGIN_SCREEN}],
      //   }),
      // );
    } catch (error) {
      console.error('Error during logout:', error);
      showToast('Error during logout', 'error', 'bottom', 1000);
    }
  };

  const handleNavigation = (item: any) => {
    if (!token) {
      navigation.navigate(Constants.LOGIN_SCREEN);
      return;
    }

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
    const sectionItems = menuItems.filter(item => item.section === sectionNumber);
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
        {data && token ? (
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
        ) : (
          <View style={styles.loginbtn}>
            <CustomButton
              title="LogIn"
              onClick={() => navigation.navigate(Constants.LOGIN_SCREEN)}
            />
          </View>
        )}

        {renderSection(1)}
        {renderSection(2)}
        {renderSection(3)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;