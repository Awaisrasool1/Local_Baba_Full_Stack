import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CountBox, DeliveryPopup, RiderChart} from '../../../components';
import {useQuery} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../api';
import {useToast} from 'react-native-toasty-toast';
import {
  get_completed_order_count,
  get_new_order_count,
} from '../../../services';
import styles from './styles';
import {getAddress, GetCurrentLocation} from '../../../hooks/Hooks';
import {Constants} from '../../../constants';

const RiderHome = (props: any) => {
  const {showToast} = useToast();
  const [visible, setVisible] = useState(true);
  const [city, setCity] = useState<string>('');

  const chartData = [
    {time: '10AM', value: 2020},
    {time: '11AM', value: 200},
    {time: '12PM', value: 1000},
    {time: '1PM', value: 200},
    {time: '2PM', value: 200},
    {time: '3PM', value: 100},
    {time: '4PM', value: 500},
  ];
  const {data} = useQuery({
    queryKey: ['newOrderCount'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return;
        }
        const res = await get_new_order_count();
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
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const locationRes: any = await GetCurrentLocation();
      const {latitude, longitude} = locationRes;
      const res: any = await getAddress(latitude, longitude);
      console.log(res);
      setCity(res?.city);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.topHeading}>{'Location'}</Text>
          <Text style={styles.topSubHeading}>
            {city ? city : 'kamalia'}
            {', Pakistan'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate(Constants.RIDER_PROFILE_SCREEN)
          }>
          <Image
            source={{
              uri: 'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.boxContainer}>
        <CountBox title="Completed Orders" count={data} />
        <CountBox title="Order Requests" count={completedOrderCount} />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>{'Total Revenue'}</Text>
        <Text style={styles.subTitle}>{'Daily'}</Text>
      </View>
      <Text style={styles.totalRevenue}>₹ {120}</Text>
      <RiderChart data={chartData} />
      <DeliveryPopup setIsVisible={setVisible} isVisible={visible} />
    </View>
  );
};

export default RiderHome;
