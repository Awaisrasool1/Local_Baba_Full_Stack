import {API} from '../api/api';

async function delete_address(id:string) {
  const res = await API.delete(`/user/Address/delete-address${id}`);
  return res;
}

export {delete_address};
