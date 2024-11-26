import {API} from '../api/api';

async function get_categories() {
  const res = await API.get('Categories/get-All-Categories');
  return res.data;
}

async function get_all_restaurants() {
  const res = await API.get('Restaurant/get-all-restaurant');
  return res.data.data;
}

async function get_nearby_restaurants() {
  const res = await API.get('Restaurants/Get-Nearby-Restaurants');
  return res.data;
}

async function get_all_product(id: string, category: string) {
  const res = await API.get(`Product/get-products/${id}`, {
    params: {category},
  });
  return res.data;
}

async function get_product_byId(id: string) {
  const res = await API.get(`Product/GetProductById/${id}`);
  return res.data;
}

async function get_cart_item() {
  const res = await API.get('/user/Cart/get_cart_Item');
  return res.data;
}

async function get_default_address() {
  const res = await API.get('/user/Address/get-user-default-address');
  return res.data;
}

async function get_profile() {
  const res = await API.get('profile/get-profile');
  return res.data;
}

async function get_all_address() {
  const res = await API.get('/user/Address/get-address');
  return res.data;
}

export const get_user_onGoing_order = async (): Promise<any[]> => {
  const res = await API.get('/user/Order/get-ongoing-order');
  return res.data;
};

export const get_user_past_order = async (): Promise<any[]> => {
  const res = await API.get('/user/Order/get-past-order');
  return res.data;
};

async function get_user_order_status(orderId: string) {
  const res = await API.get(`/user/Order/get-order-status?orderId=${orderId}`);
  return res.data;
}

async function get_order_details(orderId: string) {
  console.log(orderId)
  const res = await API.get(`/user/Order/get-order-details?orderId=${orderId}`);
  return res.data;
}

export {
  get_categories,
  get_nearby_restaurants,
  get_all_restaurants,
  get_all_product,
  get_product_byId,
  get_cart_item,
  get_default_address,
  get_profile,
  get_all_address,
  get_user_order_status,
  get_order_details,
};
