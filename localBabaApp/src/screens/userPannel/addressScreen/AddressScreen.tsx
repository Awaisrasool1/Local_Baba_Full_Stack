import React, {useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, MapPressEvent, Region} from 'react-native-maps';
import Theme from '../../../theme/Theme';
import styles from './styles';
import {useMutation} from '@tanstack/react-query';
import {useToast} from 'react-native-toasty-toast';
import {add_to_address} from '../../../services';
import {getAddress, GetCurrentLocation} from '../../../hooks/Hooks';
import {useFocusEffect} from '@react-navigation/native';

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

  useFocusEffect(
    React.useCallback(() => {
      const getLocation = async () => {
        const res: any = await GetCurrentLocation();
        setUserLocation(res);
        const {latitude, longitude} = res;
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        } as Region);
      };
      getLocation();
    }, []),
  );

  const handleMapPress = async (event: MapPressEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    const selected: Location = {latitude, longitude};
    setSelectedLocation(selected);
    try {
      const res: any = await getAddress(latitude, longitude);
      console.log(res);
      setCity(res?.city);
      setAddress(res?.address);
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
