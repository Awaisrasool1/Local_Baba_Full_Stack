import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import MapView, {Marker, Region} from 'react-native-maps';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {CustomButton, DeliveryPopup} from '../../../components';
import styles from './styles';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  fetchAddress,
  fetchDistanceAndDuration,
  GetCurrentLocation,
} from '../../../hooks/Hooks';
import {isNetworkAvailable} from '../../../api';
import {useToast} from 'react-native-toasty-toast';
import {
  get_accpted_order_buy_rider,
  get_rider_assigned_order,
} from '../../../services';
import Theme from '../../../theme/Theme';
import {Constants} from '../../../constants';

interface Location {
  latitude: number;
  longitude: number;
}
const RiderLocationScreen = () => {
  const {showToast} = useToast();
  const mapRef = useRef<MapView | null>(null);
  const PROVIDER_GOOGLE = 'google';
  const [isOnline, setIsOnline] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [deliveryItems, setDeliveryItems] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const nav: any = useNavigation();

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
          if (res.data) {
            setVisible(true);
          }
          return res.data;
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err: any) {
        console.error(err);
        throw new Error('Failed to fetch orders');
      }
    },
    enabled: isOnline ? true : false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const {data: riderData} = useQuery({
    queryKey: ['riderOrders'],
    queryFn: async () => {
      const isConnected = await isNetworkAvailable();
      if (!isConnected) {
        showToast('Check your internet!', 'error', 'bottom', 1000);
        throw new Error('No internet connection');
      }
      try {
        const res = await get_rider_assigned_order();
        if (res.status === 'success') {
          if (res.data) {
          }
          return res.data;
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err: any) {
        console.error(err);
        throw new Error('Failed to fetch orders');
      }
    },
    enabled: isFocused,
  });
  console.log(riderData);

  const handleGoOnline = () => {
    setIsOnline(true);
    refetch();
  };

  const handleCancel = () => {
    setIsOnline(false);
    queryClient.removeQueries({queryKey: ['nearbyOrders']});
  };

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
                location: 'User Location',
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
      } else if (riderData) {
        const items = await Promise.all(
          riderData.map(async (order: any) => {
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
                location: 'User Location',
                userLocation: '30.7297798,72.6437397',
                address: dropoffAddress,
                distance: dropoffDistance,
                time: dropoffTime,
              },
            };
          }),
        );
        console.log('items', items);
        nav.replace(Constants.ORDER_LOCATION_SCREEN, {
          orderId: items[0].orderId,
          restData: {
            RestAddress: items[0].pickup.address,
            locationRest: items[0].pickup.restaurantLocation,
          },
          userData: {
            userAddress: items[0].dropoff.address,
            userLocation: items[0].dropoff.userLocation,
          },
        });
      }
    };

    processOrders();
  }, [data, riderData]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 30.7123,
          longitude: userLocation ? userLocation.longitude : 72.61654,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}></MapView>

      <View style={styles.bottomContainer}>
        <View style={styles.statusContainer}>
          {isOnline ? (
            <>
              <Text style={styles.statusText}>{'Finding Nearby Orders!'}</Text>
              <Text style={styles.subText}>{'Please Wait...'}</Text>
              {isOnline && (
                <ActivityIndicator size="large" color={Theme.colors.appColor} />
              )}
            </>
          ) : (
            <Text style={styles.statusText}>{'Are you ready to Ride?'}</Text>
          )}
        </View>

        <CustomButton
          title={isOnline ? 'CANCEL' : 'GO ONLINE NOW!'}
          onClick={() => (isOnline ? handleCancel() : handleGoOnline())}
        />
      </View>
      <DeliveryPopup
        data={deliveryItems}
        onPress={() => {
          setVisible(false);
          setIsOnline(false);
        }}
        setIsOnline={setIsOnline}
        setVisible={setVisible}
        isVisible={visible}
      />
    </View>
  );
};

export default RiderLocationScreen;
