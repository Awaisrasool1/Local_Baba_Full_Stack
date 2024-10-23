import {API} from '../api/api';

async function SignIn(cred: any) {
  const res = await API.post('Auth/login', cred);
  return res;
}

async function SignUp(data: any) {
  const res = await API.post('Auth/user-signup', data);
  return res.data;
}

export {SignIn, SignUp};
