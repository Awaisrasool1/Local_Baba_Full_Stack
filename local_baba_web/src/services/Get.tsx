import { API } from "../api/api";

async function get_categories() {
  const res = await API.get("Categories/get-All-Categories");
  return res;
}

async function get_restaurant(page: number, limit: number) {
  const res = await API.get(`/admin/Restaurant/get-all-restaurant`, {
    params: { page, limit },
  });
  return res.data;
}

async function get_customers(page: number, limit: number) {
  const res = await API.get(`/admin/Customers/get-all-customer`, {
    params: { page, limit },
  });
  return res.data;
}

async function get_rider(page: number, limit: number) {
  const res = await API.get(`/admin/Riders/get-all-rider`, {
    params: { page, limit },
  });
  return res.data;
}

async function get_restaurant_products(
  pageNumber: number,
  limits: number,
  category: string
) {
  const res = await API.get(`/restaurant/Product/get-products`, {
    params: { page: pageNumber, limit: limits, category },
  });
  return res;
}

export {
  get_categories,
  get_restaurant,
  get_customers,
  get_rider,
  get_restaurant_products,
};
