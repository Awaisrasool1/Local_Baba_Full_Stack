import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {get_user_past_order} from '../../../../services/Get';
import styles from './styles';
import {OrderCard} from '../../../../components';
import {isNetworkAvailable} from '../../../../api';
import {useToast} from 'react-native-toasty-toast';
import { useNavigation } from '@react-navigation/native';
import { Constants } from '../../../../constants';

const OrderHistory = () => {
  const {showToast} = useToast();
  const nav: any = useNavigation();

  const {data} = useQuery<any>({
    queryKey: ['past_order'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return null;
        }
        const res: any = await get_user_past_order();
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
  });

  const handleTrackOrder = () => {
    console.log('Track Order clicked');
  };

  const handleCancelOrder = () => {
    console.log('Cancel Order clicked');
  };
  console.log('data', data);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.marginV10} />
      {data?.map((data: any, index: number) => (
        <OrderCard
          key={index}
          name={data.name}
          restaurant={data.restaurantName}
          image={data?.image}
          price={data?.total_amount}
          items={data?.total_items - 1}
          orderId={data?.orderId}
          status={data?.status}
          onTrackOrder={handleTrackOrder}
          onCancel={handleCancelOrder}
          onPress={() => {
            nav.navigate(Constants.ORDER_DETAILS, {id: data.orderId});
          }}
        />
      ))}
    </ScrollView>
  );
};

export default OrderHistory;
