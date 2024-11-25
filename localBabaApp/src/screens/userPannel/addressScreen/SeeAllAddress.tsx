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
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../api';
import {useToast} from 'react-native-toasty-toast';
import {delete_address, get_all_address} from '../../../services';
import { useIsFocused } from '@react-navigation/native';

const AddressCard = ({City, address, onDelete}: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.typeContainer}>
        <Image source={Theme.icons.addressHome} />
        <Text style={styles.typeText}>{'Address'}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={onDelete}>
          <Image source={Theme.icons.addressDelete} />
        </TouchableOpacity>
      </View>
    </View>
    <Text style={styles.addressText}>
      <Text style={[styles.addressText, {fontWeight: 'bold'}]}>{'City: '}</Text>
      {City}
    </Text>
    <View style={styles.margin} />
    <Text numberOfLines={2} style={styles.addressText}>
      <Text style={[styles.addressText, {fontWeight: 'bold'}]}>
        {'Full Address: '}
      </Text>
      {address}
    </Text>
  </View>
);

const SeeAllAddress = (props: any) => {
  const {showToast} = useToast();
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();

  const handleDelete = (id: any) => {
    loginMutation.mutate(id);
  };

  const loginMutation = useMutation({
    mutationFn: delete_address,
    onSuccess: async response => {
      const data = response.data;
      queryClient.invalidateQueries({queryKey: ['allAddress']});
      showToast(data.message, 'success', 'top', 1000);
    },
    onError: (error: any) => {
      showToast(error.response.data.message, 'error', 'bottom', 1000);
      console.error('Login failed:', error.response.data.message);
    },
  });

  const handleAddAddress = () => {
    props.navigation.navigate(Constants.ADDRESS_SCREEN);
  };

  const {data} = useQuery({
    queryKey: ['allAddress'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return;
        }
        const res = await get_all_address();
        return res.data;
      } catch (err: any) {
        console.log(err.response.data.message);
        showToast(err.response.data.message, 'error', 'bottom', 1000);
      }
    },
    enabled:isFocused
  });

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
        {data?.map((address: any) => (
          <AddressCard
            key={address.id}
            City={address.city}
            address={address.fullAddress}
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
