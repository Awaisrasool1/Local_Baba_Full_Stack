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

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);

  const options: any = {day: '2-digit', month: 'short', year: 'numeric'};
  const formattedDate = date.toLocaleDateString('en-US', options);

  const optionsTime: any = {hour: 'numeric', minute: '2-digit', hour12: true};
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate} – ${formattedTime.toLowerCase()}`;
};
