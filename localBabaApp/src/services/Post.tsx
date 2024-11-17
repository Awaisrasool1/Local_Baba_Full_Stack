import axios from 'axios';
import {API, getToken} from '../api/api';

async function add_to_cart(id: string) {
  const res = await API.post(`/user/Cart/add-to-cart/${id}`);
  return res.data;
}

async function add_to_address(data: any) {
  const res = await API.post(`/user/Address/add-address`, data);
  return res.data;
}

async function add_quantity(id: string) {
  const res = await API.put(`/user/Cart/add-quantity/${id}`);
  return res.data;
}

async function remove_quantity(id: string) {
  const res = await API.put(`/user/Cart/remove-quantity/${id}`);
  return res.data;
}

async function upload_image(formData: any) {
  const token = getToken();
  const res = await axios.put(
    'http://192.168.100.106:8080/user/upload-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}
export {
  add_to_cart,
  add_to_address,
  remove_quantity,
  add_quantity,
  upload_image,
};
