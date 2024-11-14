import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import MapView, {Marker, MapPressEvent, Region} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Theme from '../../../theme/Theme';
import styles from './styles';
import {useMutation} from '@tanstack/react-query';
import {useToast} from 'react-native-toasty-toast';
import {add_to_address} from '../../../services';

interface Location {
  latitude: number;
  longitude: number;
}

const AddressScreen: React.FC = (props: any) => {
  const {showToast} = useToast();
  const mapRef = useRef<MapView | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const PROVIDER_GOOGLE = 'google';

  Geocoder.init(String(''));

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const currentLocation: Location = {latitude, longitude};
        setUserLocation(currentLocation);

        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        } as Region);
      },
      (error: any) => {
        Alert.alert('Error', 'Failed to get location');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  const handleMapPress = async (event: MapPressEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    const selected: Location = {latitude, longitude};
    setSelectedLocation(selected);

    try {
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;
      const city =
        response.results[0].address_components.find((component: any) =>
          component.types.includes('locality'),
        )?.long_name || '';
      setAddress(address);
      setCity(city);
    } catch (error) {
      console.warn('Failed to get address:', error);
    }
  };

  const addMutation = useMutation({
    mutationFn: add_to_address,
    onSuccess: res => {
      showToast(res.message, 'success', 'top', 1000);
      setTimeout(() => {
        props.navigation.goBack();
      }, 900);
    },
    onError: (error: any) => {
      showToast(error.response.data.message, 'error', 'bottom', 1000);
    },
  });

  const handlePress = () => {
    if (address && city && selectedLocation) {
      const {latitude, longitude} = selectedLocation;
      addMutation.mutate({
        fullAddress: address,
        city: city,
        latlong: String(`${latitude},${longitude}`),
      });
    } else {
      showToast(
        'Please select a location on the map.',
        'error',
        'bottom',
        1000,
      );
    }
  };

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
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        }}
        onPress={handleMapPress}>
        {selectedLocation && (
          <Marker coordinate={selectedLocation}>
            <Image source={Theme.icons.marker} />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.backArrow}>
        <Image source={Theme.icons.leftArrowBg} />
      </TouchableOpacity>

      <View style={styles.addressContainer}>
        <TextInput
          style={styles.addressInput}
          value={address}
          editable={false}
          multiline
          placeholder="Enter address"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handlePress}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressScreen;
