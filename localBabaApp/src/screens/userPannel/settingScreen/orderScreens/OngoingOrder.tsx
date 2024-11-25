import {View} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {get_user_onGoing_order} from '../../../../services';
import {OrderCard} from '../../../../components';
import styles from './styles';
import {isNetworkAvailable} from '../../../../api';
import {useToast} from 'react-native-toasty-toast';

const OngoingOrder = () => {
  const {showToast} = useToast();

  const {data} = useQuery<any>({
    queryKey: ['onGoing'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return null;
        }
        const res: any = await get_user_onGoing_order();
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

  return (
    <View style={styles.container}>
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
          onTrackOrder={handleTrackOrder}
          onCancel={handleCancelOrder}
        />
      ))}
    </View>
  );
};

export default OngoingOrder;
