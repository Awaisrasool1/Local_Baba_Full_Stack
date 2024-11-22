import {View} from 'react-native';
import React from 'react';
import {OrderProgress} from '../../../components';
import styles from './styles';
import {useQuery} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../api';
import {useToast} from 'react-native-toasty-toast';
import {useIsFocused} from '@react-navigation/native';
import {get_user_order_status} from '../../../services';

const TrackOrder = (props: any) => {
  const {id} = props.route.params;
  const {showToast} = useToast();
  const isFocused = useIsFocused();
  const steps = [
    {
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being processed',
    },
    {
      title: 'Preparing',
      description: 'Restaurant is preparing your delicious meal',
    },
    {
      title: 'On the Way',
      description: 'Your order has been picked up for delivery',
    },
    {
      title: 'Delivered',
      description: 'Enjoy your meal!',
    },
  ];

  const {data} = useQuery({
    queryKey: ['orderStatus'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return null;
        }
        let data = {
          OrderId: '#95650090',
        };
        const res = await get_user_order_status(data);
        return res.data;
      } catch (err: any) {
        console.log(err.response.data);
        showToast(
          err.response?.data?.message || 'An error occurred',
          'error',
          'bottom',
          1000,
        );
        return null;
      }
    },
    enabled: isFocused,
  });
  return (
    <View style={styles.container}>
      <OrderProgress currentStep={3} steps={steps} />
    </View>
  );
};

export default TrackOrder;
