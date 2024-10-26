import {API} from '../api/api';

async function get_categories() {
  const res = await API.get('Categories/get-All-Categories');
  return res.data;
}

async function get_all_restaurants() {
  const res = await API.get('Restaurant/Get-All-Restaurant');
  return res.data.data;
}

async function get_nearby_restaurants() {
  const res = await API.get('Restaurants/Get-Nearby-Restaurants');
  return res.data;
}

async function get_all_product(id: string) {
  const res = await API.get(`Product/GetAllProduct/${id}`);
  return res.data;
}

export {
  get_categories,
  get_nearby_restaurants,
  get_all_restaurants,
  get_all_product,
};
