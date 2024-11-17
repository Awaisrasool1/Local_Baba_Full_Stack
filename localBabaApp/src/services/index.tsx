import {SignIn, SignUp} from './Auth';
import {
  get_categories,
  get_all_restaurants,
  get_nearby_restaurants,
  get_all_product,
  get_product_byId,
  get_cart_item,
  get_default_address,
  get_profile,
  get_all_address,
} from './Get';
import {
  add_to_cart,
  add_to_address,
  add_quantity,
  remove_quantity,
  upload_image
} from './Post';
import {delete_address, delete_cart_item} from './Delete';

export {
  SignIn,
  SignUp,
  get_categories,
  get_all_restaurants,
  get_nearby_restaurants,
  get_all_product,
  get_product_byId,
  add_to_cart,
  get_cart_item,
  get_default_address,
  add_to_address,
  get_profile,
  get_all_address,
  delete_address,
  remove_quantity,
  add_quantity,
  delete_cart_item,
  upload_image
};
