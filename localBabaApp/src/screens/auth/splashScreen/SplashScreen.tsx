import React, {useCallback, useEffect} from 'react';
import {Image, StatusBar, View} from 'react-native';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import Theme from '../../../theme/Theme';
import {Constants} from '../../../constants';

const SplashScreen = (props: any) => {
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: Constants.LOGIN_SCREEN,
            },
          ],
        });
      }, 1500);
    }, []),
  );

  return (
    <>
      <StatusBar hidden />
      <View style={styles.mainContainer}>
        <View style={styles.viewMainContainer}>
          <Image source={Theme.icons.splash_Logo} />
        </View>
      </View>
    </>
  );
};

export default SplashScreen;
