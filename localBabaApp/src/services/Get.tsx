import {API} from '../api/api';

async function get_categories() {
  const res = await API.get('Categories/get-All-Categories');
  return res.data;
}

async function get_all_restaurants() {
  const res = await API.get('/user/Restaurant/get-all-restaurant');
  return res.data.data;
}

async function get_nearby_restaurants() {
  const res = await API.get('Restaurants/Get-Nearby-Restaurants');
  return res.data;
}

async function get_all_product(id: string, category: string) {
  const res = await API.get(`/user/Product/get-products/${id}`, {
    params: {category},
  });
  return res.data;
}

async function get_product_byId(id: string) {
  const res = await API.get(`/user/Product/GetProductById/${id}`);
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

export {
  get_categories,
  get_nearby_restaurants,
  get_all_restaurants,
  get_all_product,
  get_product_byId,
  get_cart_item,
  get_default_address,
};
