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

async function get_nonPenging_orders(page: number, limit: number) {
  const res = await API.get(`/restaurant/Order/get-nonPending-orders`, {
    params: { page, limit },
  });
  return res;
}

async function get_penging_orders(page: number, limit: number) {
  const res = await API.get(`/restaurant/Order/get-pending-orders`, {
    params: { page, limit },
  });
  return res;
}

async function get_admin_dashboard() {
  const res = await API.get('/admin/Dashboard/dashboard-counts');
  return res;
}

async function get_restaurant_dashboard() {
  const res = await API.get('/restaurant/Dashboard/dashboard-count');
  return res;
}

export {
  get_categories,
  get_restaurant,
  get_customers,
  get_rider,
  get_restaurant_products,
  get_nonPenging_orders,
  get_penging_orders,
  get_admin_dashboard,
  get_restaurant_dashboard,
};
