import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {AxiosError, AxiosResponse} from 'axios';
import styles from './styles';
import {Constants, Validations} from '../../../constants';
import Theme from '../../../theme/Theme';
import {CustomButton, InputText, LoginBg} from '../../../components';
import {SignIn} from '../../../services';
import {saveToken} from '../../../api/api';
import {saveDataToCachedWithKey} from '../../../module/cacheData';
import {AppConstants} from '../../../module';
import {useToast} from 'react-native-toasty-toast';

type SignInData = {Email: string; Password: string};
type SignInResponse = {
  token: string;
  role: string;
  userId: string;
  name: string;
  message: string;
};

const LoginScreen = (props: any) => {
  const {showToast} = useToast();
  const [textEmail, setTextEmail] = useState<string>('awais@gmail.com');
  const [textPassword, setTextPassword] = useState<string>('Helo*1234');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [isSecure, setIsSecure] = useState<boolean>(false);

  const isAllValid = () => {
    let isValid = true;
    setErrorEmail('');
    setErrorPassword('');

    if (!Validations.isValidEmail(textEmail)) {
      isValid = false;
      setErrorEmail('*Please enter a valid email!');
    } else if (!Validations.isValidPassword(textPassword)) {
      isValid = false;
      setErrorPassword(
        '*Password must have 8 characters with 1 special character, 1 capital, 1 small, and 1 number!',
      );
    }
    return isValid;
  };

  const loginMutation = useMutation<
    AxiosResponse<SignInResponse>,
    AxiosError,
    SignInData
  >({
    mutationFn: SignIn,
    onSuccess: async response => {
      const data = response.data;
      if (data && (Number(data.role) === 4 || Number(data.role) === 4)) {
        await saveToken(data.token, '', data.name);
        await saveDataToCachedWithKey(
          AppConstants.AsyncKeyLiterals.loginToken,
          data.token,
        );
        await saveDataToCachedWithKey(
          AppConstants.AsyncKeyLiterals.isLoggedIn,
          true,
        );
        await saveDataToCachedWithKey(
          AppConstants.AsyncKeyLiterals.userId,
          data.userId,
        );
        await saveDataToCachedWithKey(
          AppConstants.AsyncKeyLiterals.userName,
          data.name,
        );
        showToast(data.message, 'success', 'top', 1000);
        props.navigation.reset({
          index: 0,
          routes: [{name: Constants.DRAWER_NAVIGATION}],
        });
      } else {
        console.log('Invalid user role.');
      }
    },
    onError: (error: any) => {
      showToast(error.response.data.message, 'error', 'bottom', 1000);
      console.error('Login failed:', error.response.data.message);
    },
  });

  const handleLogin = () => {
    if (isAllValid()) {
      loginMutation.mutate({Email: textEmail, Password: textPassword});
    }
  };

  return (
    <>
      <StatusBar
        hidden={false}
        backgroundColor={Theme.colors.white}
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.viewContainer}>
          <LoginBg />
          <ScrollView style={styles.viewCenter}>
            <View style={styles.marginV8} />
            <View style={styles.marginV8} />
            <InputText
              value={textEmail}
              title="Email"
              error={errorEmail}
              onChangeText={setTextEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
            />
            <View style={styles.marginV8} />
            <InputText
              value={textPassword}
              title="Password"
              error={errorPassword}
              isPassword={true}
              secure={isSecure}
              onChangeSecurity={() => setIsSecure(!isSecure)}
              onChangeText={setTextPassword}
              placeholder="Enter your password"
            />
            <View style={styles.marginV8} />
            <View style={styles.marginV8} />
            <CustomButton title="Log In" onClick={handleLogin} />
            <View style={styles.marginV8} />
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(Constants.SIGNUP_SCREEN)
              }>
              <Text style={styles.dontText}>
                Don't have an account?
                <Text style={styles.SignUpText}> Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;
