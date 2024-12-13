import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {DeliveryCard, Header} from '../../../components';
import {useFocusEffect} from '@react-navigation/native';
import {
  fetchAddress,
  fetchDistanceAndDuration,
  GetCurrentLocation,
} from '../../../hooks/Hooks';
import {useToast} from 'react-native-toasty-toast';
import {useQuery} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../api';
import {get_accpted_order_buy_rider, order_assigned} from '../../../services';
import MapView, {Region} from 'react-native-maps';
import styles from './styles';
import {Constants} from '../../../constants';

interface Location {
  latitude: number;
  longitude: number;
}
const OrderRequests = (props: any) => {
  const {showToast} = useToast();
  const mapRef = useRef<MapView | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [deliveryItems, setDeliveryItems] = useState<any[]>([]);

  const {data, refetch} = useQuery({
    queryKey: ['nearbyOrders'],
    queryFn: async () => {
      const isConnected = await isNetworkAvailable();
      if (!isConnected) {
        showToast('Check your internet!', 'error', 'bottom', 1000);
        throw new Error('No internet connection');
      }
      try {
        const res = await get_accpted_order_buy_rider();
        if (res.status === 'success') {
          return res.data;
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err: any) {
        console.error(err);
        throw new Error('Failed to fetch orders');
      }
    },
    enabled: true,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  useFocusEffect(
    React.useCallback(() => {
      const getLocation = async () => {
        const res: any = await GetCurrentLocation();
        setUserLocation(res);
        const {latitude, longitude} = res;
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        } as Region);
      };
      getLocation();
    }, []),
  );

  useEffect(() => {
    const processOrders = async () => {
      if (data) {
        const items = await Promise.all(
          data.map(async (order: any) => {
            const pickupAddress = await fetchAddress(order.restaurantLatLong);
            const dropoffAddress = await fetchAddress(order.userLatLong);
            const {distance: pickupDistance, time: pickupTime} =
              await fetchDistanceAndDuration(
                // userLocation?.latitude + ',' + userLocation?.longitude,
                '30.7297798,72.6437397',
                // order.restaurantLatLong,
                '30.7288951,72.6583164',
              );
            const {distance: dropoffDistance, time: dropoffTime} =
              await fetchDistanceAndDuration(
                // order.restaurantLatLong,
                '30.7288951,72.6583164',
                // order.userLatLong,
                '30.7206895,72.6596632',
              );
            return {
              orderId: order.orderId,
              totalBill: `$${order.totalPrice.toFixed(2)}`,
              paymentMethod: 'Cash On Delivery',
              pickup: {
                restaurantLocation: '30.7288951,72.6583164',
                location: order.restaurantName,
                address: pickupAddress,
                distance: pickupDistance,
                time: pickupTime,
              },
              dropoff: {
                location: order.userName,
                userLocation: '30.7297798,72.6437397',
                address: dropoffAddress,
                distance: dropoffDistance,
                time: dropoffTime,
              },
            };
          }),
        );
        console.log('items', items);
        setDeliveryItems(items);
      }
    };

    processOrders();
  }, [data]);

  const sendData = async (item: any) => {
    try {
      let data = {
        id: item.orderId,
      };
      const res = await order_assigned(data);
      console.log('res', res);
      props.navigation.navigate(Constants.ORDER_LOCATION_SCREEN, {
        orderId: item.orderId,
        restData: {
          RestAddress: item.pickup.address,
          locationRest: item.pickup.restaurantLocation,
        },
        userData: {
          userAddress: item.dropoff.address,
          userLocation: item.dropoff.userLocation,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.marginV10}>
        <Header
          isBack={true}
          isBackTitle="Order Requests"
          onlyBack
          onBack={() => props.navigation.goBack()}
        />
      </View>
      <View style={styles.marginV5} />
      <ScrollView>
        {deliveryItems?.map((item, index) => (
          <DeliveryCard key={index} {...item} onAccept={() => sendData(item)} />
        ))}
      </ScrollView>
    </View>
  );
};

export default OrderRequests;
