import React, {useRef, useState, useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import {CustomButton, InputText} from '../../../components';
import Theme from '../../../theme/Theme';
import {GetCurrentLocation} from '../../../hooks/Hooks';

interface Location {
  latitude: number;
  longitude: number;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyBgQRFgYaylySLYTxiFEuilE1dSzVDLL5U';

const OrderLocationScreen = (props: any) => {
  const mapRef = useRef<MapView | null>(null);
  const [riderLocation, setRiderLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [status, setStatus] = useState<'Pickup' | 'Delivered'>('Pickup');

  const {restData, userData} = props.route.params;
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

  const handlePickup = () => {
    if (status === 'Pickup') {
      setStatus('Delivered')
      setDestination(userDeliveryLocation);
    } else {
      Alert.alert('Info', 'Order already delivered!');
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
            description="Your current location"
          />
        )}

        {destination && (
          <Marker
            coordinate={destination}
            title={status === 'Pickup' ? 'Restaurant' : 'User'}
            description={
              status === 'Pickup' ? 'Restaurant Location' : 'User Location'
            }
          />
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
    </View>
  );
};

export default OrderLocationScreen;
