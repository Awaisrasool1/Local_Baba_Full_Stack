import {API} from '../api/api';

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

export {add_to_cart, add_to_address, remove_quantity, add_quantity};
