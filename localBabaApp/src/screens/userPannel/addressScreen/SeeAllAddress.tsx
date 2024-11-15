import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {CustomButton, Header} from '../../../components';
import Theme from '../../../theme/Theme';
import styles from './styles';
import {Constants} from '../../../constants';

const AddressCard = ({type, address, onDelete}: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.typeContainer}>
        <Image source={Theme.icons.addressHome} />
        <Text style={styles.typeText}>{type}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={onDelete}>
          <Image source={Theme.icons.addressDelete} />
        </TouchableOpacity>
      </View>
    </View>
    <Text numberOfLines={2} style={styles.addressText}>
      {address}
    </Text>
  </View>
);

const SeeAllAddress = (props: any) => {
  const addresses = [
    {
      id: '1',
      type: 'HOME',
      address: '2464 Royal Ln. Mesa, New Jersey 45463',
    },
    {
      id: '2',
      type: 'WORK',
      address: '3891 Ranchview Dr. Richardson, California 62639',
    },
  ];

  const handleDelete = (id: any) => {
    console.log('Delete address:', id);
  };

  const handleAddAddress = () => {
    props.navigation.navigate(Constants.ADDRESS_SCREEN);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.paddingH10}>
        <Header
          isBack
          isBackTitle="Edit location"
          onlyBack
          onBack={() => props.navigation.goBack()}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {addresses.map(address => (
          <AddressCard
            key={address.id}
            type={address.type}
            address={address.address}
            onDelete={() => handleDelete(address.id)}
          />
        ))}
        <CustomButton
          title="Add new address"
          onClick={() => handleAddAddress()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeeAllAddress;
