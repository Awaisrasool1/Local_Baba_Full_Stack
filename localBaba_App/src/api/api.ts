import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {cacheData} from '../module';

const API_BASE_URL = 'http://192.168.100.91:8080/';
let token: any;
let role: any;

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
});

API.interceptors.request.use(
  function (_config: any) {
    _config.headers['Content-Type'] = 'application/json';

    if (token !== null && token !== '') {
      _config.headers.Authorization = 'Bearer ' + token;
    }
    return _config;
  },
  function (error) {
    console.log('API ERROR :: ' + JSON.stringify(error));
  },
);

export const API_FORMDATA = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

API_FORMDATA.interceptors.request.use(
  function (_config: any) {
    _config.headers['Content-Type'] = 'multipart/form-data';

    if (token !== null && token !== '') {
      _config.headers.Authorization = 'Bearer ' + token;
    }
    return _config;
  },
  function (error) {
    console.log('API ERROR :: ' + JSON.stringify(error));
  },
);

export const apiError = (error: any) => {
  console.log(error?.response);
  if (error.response) {
    if (error?.response.status == 401) {
      return 'Unauthorized User! Please Login again.';
    } else if (error.response.status == 403) {
      return 'You are not authorized to access the requested resource.';
    } else if (error.response.status == 404) {
      return 'Requested URL not found.';
    } else if (error.response.status == 500) {
      return 'Internal Server Error';
    } else {
      return error.response.data.message;
    }
  } else if (error.message) {
    return error.message;
  }
};

export const saveToken = (data?: any, Role?: any) => {
  token = data;
  role = Role;
};

export const getRole = () => {
  return role;
};

export const getToken = () => {
  return token;
};

export const isNetworkAvailable = async () => {
  let response = false;
  await NetInfo.fetch().then((networkState: any) => {
    response = networkState.isConnected;
  });
  return response;
};

export const logout = () => {
  cacheData.removeAllDataFromCache();
  // saveToken(null);
};

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;

  return `${dayOfWeek} ${month}/${day}/${year} @${hours}:${minutes}${ampm}`;
};
