import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import Theme from '../../../theme/Theme';
import {Header} from '../../../components';
import {Constants} from '../../../constants';

const SettingScreen = () => {
  const navigation: any = useNavigation();

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
    {
      id: 'logout',
      title: 'Log Out',
      icon: Theme.icons.logout,
      section: 3,
    },
  ];

  const renderMenuItem = ({id, title, icon}: any) => (
    <TouchableOpacity
      key={id}
      style={styles.menuItem}
      onPress={() => navigation.navigate(id)}>
      <View style={styles.menuItemLeft}>
        <Image source={icon} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Image source={Theme.icons.rightArrow} />
    </TouchableOpacity>
  );

  const renderSection = (sectionNumber: any) => {
    const sectionItems = menuItems.filter(
      item => item.section === sectionNumber,
    );
    return (
      <View style={styles.section}>{sectionItems.map(renderMenuItem)}</View>
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
            source={{uri: 'https://via.placeholder.com/100'}}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>abc@email.com</Text>
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
