import React, {useState} from 'react';
import {Image, SafeAreaView, StatusBar, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {Validations} from '../../../constants';
import Theme from '../../../theme/Theme';
import {CustomButton, InputText} from '../../../components';

const LoginScreen = (props: any) => {
  // All States
  const [isSecure, setIsSecure] = useState<boolean>(false);
  // Main States
  const [textEmail, setTextEmail] = useState<string>('');
  const [textPassword, setTextPassword] = useState<string>('');
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
      setErrorEmail(
        '*Password must have 8 characters with 1 speacial character 1 capital 1 small and 1 number!',
      );
    }

    return isValid;
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
          <Image
            source={Theme.icons.FullIcon}
            style={styles.imageMain}
            resizeMode={'contain'}
          />
          <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.viewCenter}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.textTitle}>{'Sign In'}</Text>
            <View style={styles.marginV8}>
              <InputText
                value={textEmail}
                title={'Email'}
                error={errorEmail}
                onChangeText={setTextEmail}
                keyboardType={'email-address'}
                viewMainStyle={styles.marginV5}
                placeholder={'Enter your email'}
              />
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
          </KeyboardAwareScrollView>
          <CustomButton
            title={'Continue'}
            bgStyle={styles.viewButton}
            onClick={() => {
              if (isAllValid()) {
              }
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;
