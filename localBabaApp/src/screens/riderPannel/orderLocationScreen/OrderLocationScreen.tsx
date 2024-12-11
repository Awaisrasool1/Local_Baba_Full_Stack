import React, {useRef, useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import {CustomButton, InputText, RiderPopup} from '../../../components';
import Theme from '../../../theme/Theme';
import {GetCurrentLocation} from '../../../hooks/Hooks';
import {Deliverd_order, picked_order} from '../../../services';
import {useNavigation} from '@react-navigation/native';

interface Location {
  latitude: number;
  longitude: number;
}

const GOOGLE_MAPS_API_KEY = '';

const OrderLocationScreen = (props: any) => {
  const mapRef = useRef<MapView | null>(null);
  const [riderLocation, setRiderLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [status, setStatus] = useState<'Pickup' | 'Delivered'>('Pickup');
  const [visible, setVisible] = useState(false);
  const nav: any = useNavigation();

  const {restData, userData, orderId} = props.route.params;
  const {userAddress, userLocation} = userData;
  const {RestAddress, locationRest} = restData;

  const parseLocation = (locationString: string): Location => {
    const [latitude, longitude] = locationString.split(',').map(Number);
    return {latitude, longitude};
  };

  const restaurantLocation = parseLocation(locationRest);
  const userDeliveryLocation = parseLocation(userLocation);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const latlong: any = await GetCurrentLocation();
      const latitude = 30.7324911;
      const longitude = 72.6953991;

      setRiderLocation({latitude, longitude});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (locationRest) {
      setDestination(restaurantLocation);
    }
  }, [locationRest]);

  useEffect(() => {
    if (riderLocation && destination) {
      mapRef.current?.fitToCoordinates([riderLocation, destination], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [status, riderLocation, destination]);

  const handlePickup = async () => {
    if (status === 'Pickup') {
      try {
        let data = {
          Id: orderId,
        };
        const res = await picked_order(data);
        console.log(res);
        if (res.status == 'success') {
          setStatus('Delivered');
          setDestination(userDeliveryLocation);
        }
      } catch (err: any) {
        console.log(err.response.data);
      }
    } else {
      try {
        let data = {
          Id: orderId,
        };
        const res = await Deliverd_order(data);
        console.log(res);
        if (res.status == 'success') {
          setVisible(true);
        }
      } catch (err: any) {
        console.log(err.response.data);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: restaurantLocation.latitude,
          longitude: restaurantLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {riderLocation && (
          <Marker
            coordinate={riderLocation}
            title="Rider"
            description="Your current location">
            <Image source={Theme.icons.rider_icon_location} />
          </Marker>
        )}

        {destination && (
          <Marker
            coordinate={destination}
            title={status === 'Pickup' ? 'Restaurant' : 'User'}
            description={
              status === 'Pickup' ? 'Restaurant Location' : 'User Location'
            }>
            <Image
              source={
                status === 'Pickup'
                  ? Theme.icons.rest_location_icon
                  : Theme.icons.deliverd_icon
              }
            />
          </Marker>
        )}

        {riderLocation && destination && (
          <MapViewDirections
            origin={riderLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor={Theme.colors.appColor}
            onError={error => console.error('Directions Error:', error)}
          />
        )}
      </MapView>

      <View style={styles.bottomContainer}>
        <View style={styles.marginV10} />
        <InputText
          title={status === 'Pickup' ? 'Pickup Location' : 'Delivery Location'}
          value={status === 'Pickup' ? RestAddress : userAddress}
          isEditable={false}
        />
        <View style={styles.marginV10} />
        <CustomButton
          title={status === 'Pickup' ? 'Picked Up' : 'Delivered'}
          onClick={handlePickup}
        />
      </View>
      <RiderPopup isVisible={visible} setVisible={setVisible} />
    </View>
  );
};

export default OrderLocationScreen;
