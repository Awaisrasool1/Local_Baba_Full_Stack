import React, {useCallback, useEffect} from 'react';
import {Image, StatusBar, View} from 'react-native';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import Theme from '../../../theme/Theme';
import {Constants} from '../../../constants';
import {getDataFromCachedWithKey} from '../../../module/cacheData';
import {AppConstants} from '../../../module';
import {saveToken} from '../../../api/api';

const SplashScreen = (props: any) => {
  useFocusEffect(
    useCallback(() => {
      setTimeout(async () => {
        try {
          let token = await getDataFromCachedWithKey(
            AppConstants.AsyncKeyLiterals.loginToken,
          );
          let name = await getDataFromCachedWithKey(
            AppConstants.AsyncKeyLiterals.userName,
          );
          if (token) {
            await saveToken(token, '', name);
          }
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: Constants.DRAWER_NAVIGATION,
              },
            ],
          });
        } catch (err) {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: Constants.DRAWER_NAVIGATION,
              },
            ],
          });
        }
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
