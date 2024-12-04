import { SignIn, SignUp } from "./Auth";
import {
  add_restaurant,
  add_rider,
  createProduct,
  uploadImage,
  order_status_change,
} from "./Post";
import {
  get_categories,
  get_restaurant,
  get_customers,
  get_rider,
  get_restaurant_products,
  get_nonPenging_orders,
  get_penging_orders,
  get_admin_dashboard,
  get_restaurant_dashboard,
} from "./Get";

export {
  get_restaurant_dashboard,
  SignIn,
  add_restaurant,
  get_categories,
  SignUp,
  get_restaurant,
  get_customers,
  get_rider,
  add_rider,
  createProduct,
  uploadImage,
  get_restaurant_products,
  get_nonPenging_orders,
  get_penging_orders,
  order_status_change,
  get_admin_dashboard,
};
