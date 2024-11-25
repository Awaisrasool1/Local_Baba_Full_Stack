import {API} from '../api/api';

async function delete_address(id:string) {
  const res = await API.delete(`/user/Address/delete-address${id}`);
  return res;
}

async function delete_cart_item(id:string) {
  const res = await API.delete(`/user/Cart/item-delete${id}`);
  return res;
}

export {delete_address,delete_cart_item};
