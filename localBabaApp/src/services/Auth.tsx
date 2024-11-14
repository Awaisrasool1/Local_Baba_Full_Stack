import {API} from '../api/api';

async function SignIn(data: any) {
  const res = await API.post('Auth/login', data);
  return res;
}

async function SignUp(data: any) {
  const res = await API.post('Auth/user-signup', data);
  return res;
}

export {SignIn, SignUp};
