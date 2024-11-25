import {View, Text, StatusBar, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {CustomButton, InputText, LoginBg} from '../../../components';
import Theme from '../../../theme/Theme';
import {styles} from './styles';
import {isNetworkAvailable} from '../../../api';
import {Constants, Validations} from '../../../constants';
import {SignUp} from '../../../services';

const SignUpScreen = (props: any) => {
  // All States
  const [isSecure, setIsSecure] = useState<boolean>(false);
  const [isSecure1, setIsSecure1] = useState<boolean>(false);
  // Main States
  const [textName, setTextName] = useState<string>('');
  const [textEmail, setTextEmail] = useState<string>('');
  const [textPassword, setTextPassword] = useState<string>('');
  const [textReType, setTextReType] = useState<string>('');
  const [textPhone, setTextPhone] = useState<string>('');

  // Error States
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [errorName, setErrorName] = useState<string>('');
  const [errorPhone, setErrorPhone] = useState<string>('');
  const [errorReType, setErrorReType] = useState<string>('');

  // End States

  const isAllValid = () => {
    let isValid = true;

    setErrorEmail('');
    setErrorPassword('');
    setErrorReType('');
    setErrorPhone('');
    setErrorName('');
    if (textName == '') {
      isValid = false;
      setErrorName('*Please enter Name');
    } else if (!Validations.isValidEmail(textEmail)) {
      isValid = false;
      setErrorEmail('*Please enter valid email!');
    } else if (textPhone == '') {
      isValid = false;
      setErrorPhone('*Please enter Phone No');
    } else if (!Validations.isValidPassword(textPassword)) {
      isValid = false;
      setErrorPassword(
        '*Password must have 8 characters with 1 speacial character 1 capital 1 small and 1 number!',
      );
    } else if (textPassword != textReType) {
      isValid = false;
      setErrorReType("*Password Doesn't Match!");
    }

    return isValid;
  };

  const doLogin = async () => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        let data = {
          name: textName,
          Email: textEmail,
          Password: textPassword,
          phone: textPhone,
          role: 4,
        };
        const res = await SignUp(data);
        if (res.data.status == 'success') {
          props.navigation.navigate(Constants.LOGIN_SCREEN);
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
          <LoginBg isTitle onBack={() => props.navigation.goBack()} />
          <ScrollView style={styles.viewCenter}>
            <View style={styles.marginV8}>
              <InputText
                value={textName}
                title={'Name'}
                error={errorName}
                onChangeText={setTextName}
                keyboardType={'email-address'}
                viewMainStyle={styles.marginV5}
                placeholder={'Enter your name'}
              />
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
                value={textPhone}
                title={'Phone no'}
                error={errorPhone}
                onChangeText={setTextPhone}
                keyboardType={'email-address'}
                viewMainStyle={styles.marginV5}
                placeholder={'Enter your phone no'}
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
                placeholder={'********'}
              />
              <View style={styles.marginV5} />
              <InputText
                value={textReType}
                title={'Re-Type Password'}
                error={errorReType}
                isPassword={true}
                secure={isSecure1}
                onChangeSecurity={() => {
                  setIsSecure1(!isSecure1);
                }}
                onChangeText={setTextReType}
                viewMainStyle={styles.marginV5}
                placeholder={'********'}
              />
            </View>
            <CustomButton
              title={'Create an account'}
              bgStyle={styles.viewButton}
              onClick={() => {
                if (isAllValid()) {
                  doLogin();
                }
              }}
            />
            <View style={styles.marginV5} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SignUpScreen;
