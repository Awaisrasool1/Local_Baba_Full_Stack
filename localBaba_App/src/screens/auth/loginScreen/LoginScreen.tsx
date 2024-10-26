import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {Constants, Validations} from '../../../constants';
import Theme from '../../../theme/Theme';
import {CustomButton, InputText, LoginBg} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {SignIn} from '../../../services';
import {saveToken} from '../../../api/api';
import {saveDataToCachedWithKey} from '../../../module/cacheData';
import {AppConstants} from '../../../module';

const LoginScreen = (props: any) => {
  // All States
  const [isSecure, setIsSecure] = useState<boolean>(false);
  // Main States
  const [textEmail, setTextEmail] = useState<string>('ar30781871@gmail.com');
  const [textPassword, setTextPassword] = useState<string>('Helo*1234');
  // Error States
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  // End States

  const isAllValid = () => {
    let isValid = true;

    setErrorEmail('');
    setErrorPassword('');

    if (!Validations.isValidEmail(textEmail)) {
      isValid = false;
      setErrorEmail('*Please enter valid email!');
    } else if (!Validations.isValidPassword(textPassword)) {
      isValid = false;
      setErrorPassword(
        '*Password must have 8 characters with 1 speacial character 1 capital 1 small and 1 number!',
      );
    }

    return isValid;
  };
  const doLogin = async () => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        let data = {
          Email: textEmail,
          Password: textPassword,
        };
        const res = await SignIn(data);
        if (res.status == 200) {
          saveToken(res.data.token,'',res.data.name);
          saveDataToCachedWithKey(
            AppConstants.AsyncKeyLiterals.loginToken,
            res.data.token,
          );
          saveDataToCachedWithKey(
            AppConstants.AsyncKeyLiterals.isLoggedIn,
            true,
          );
          saveDataToCachedWithKey(
            AppConstants.AsyncKeyLiterals.userId,
            res.data.userId,
          );
          saveDataToCachedWithKey(
            AppConstants.AsyncKeyLiterals.userName,
            res.data.name,
          );
          props.navigation.reset({
            index: 0,
            routes: [{name: Constants.LOCATION_ACCESS_SCREEN}],
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <StatusBar
        hidden={false}
        backgroundColor={Theme.colors.white}
        barStyle={'dark-content'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.viewContainer}>
          <LoginBg />
          <ScrollView style={styles.viewCenter}>
            <View style={styles.marginV8}>
              <View style={styles.marginV5} />
              <InputText
                value={textEmail}
                title={'Email'}
                error={errorEmail}
                onChangeText={setTextEmail}
                keyboardType={'email-address'}
                viewMainStyle={styles.marginV5}
                placeholder={'Enter your email'}
              />
              <View style={styles.marginV5} />
              <InputText
                value={textPassword}
                title={'Password'}
                error={errorPassword}
                isPassword={true}
                secure={isSecure}
                onChangeSecurity={() => {
                  setIsSecure(!isSecure);
                }}
                onChangeText={setTextPassword}
                viewMainStyle={styles.marginV5}
                placeholder={'Enter your password'}
              />
            </View>
            <CustomButton
              title={'Log In'}
              bgStyle={styles.viewButton}
              onClick={() => {
                if (isAllValid()) {
                  doLogin();
                }
              }}
            />
            <View style={styles.marginV5} />
            <Text style={styles.dontText}>
              {'Don’t have an account?'}
              <Text style={styles.SignUpText}>{' Sign Up'}</Text>
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;
