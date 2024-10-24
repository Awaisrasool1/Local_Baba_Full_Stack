import {API} from '../api/api';

async function get_categories() {
  const res = await API.get('Categories/get-All-Categories');
  return res.data;
}

export {get_categories};
