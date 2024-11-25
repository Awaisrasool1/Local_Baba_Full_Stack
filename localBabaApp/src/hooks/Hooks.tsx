import Geocoder from 'react-native-geocoding';
import {checkPermission} from '../api/api';
import GetLocation from 'react-native-get-location';


Geocoder.init('');

export const getAddress = async (latitude: any, longitude: any) => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    const address = response.results[0].formatted_address;
    const city =
      response.results[0].address_components.find((component: any) =>
        component.types.includes('locality'),
      )?.long_name || '';
    return {address, city};
  } catch (err) {
    console.log(err);
  }
};

export const GetCurrentLocation = async () => {
  try {
    const result = await checkPermission('location');
    if (result.result) {
      const currentLocation = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
      });
      const {latitude, longitude} = currentLocation;
      const newLocation = {latitude, longitude};
      return newLocation;
    }
  } catch (err) {
    console.log(err);
  }
};
