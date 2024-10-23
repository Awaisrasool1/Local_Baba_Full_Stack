/* eslint-disable no-useless-escape */
export const isValidEmail = (email: string) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/;
  return reg.test(email);
};

export const isValidPassword = (password: string) => {
  if (password.length < 8) {
    return false;
  } else {
    const hasNumber =
      /^(?=.{8,}$)(?=.*?[A-Z a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/;
    return hasNumber.test(password);
  }
};

export const isValidUrl = (url: string) => {
  const reg =
    /(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})\.([a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  if (url !== 'https://' && url !== '') {
    return reg.test(url);
  } else {
    return true;
  }
};
