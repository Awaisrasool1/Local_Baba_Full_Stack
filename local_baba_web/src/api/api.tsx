import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.93:8080/';

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
});


API.interceptors.request.use(
  function (_config: any) {
    _config.headers['Content-Type'] = 'application/json';
    let token = localStorage.getItem("token")
    if (token !== null && token !== '') {
      _config.headers.Authorization = 'Bearer ' + token;
    }
    return _config;
  },
  function (error) {
    console.log('API ERROR :: ' + JSON.stringify(error));
    return Promise.reject(error);
  },
);

