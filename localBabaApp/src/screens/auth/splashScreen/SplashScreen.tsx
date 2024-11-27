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
          let role = await getDataFromCachedWithKey(
            AppConstants.AsyncKeyLiterals.role,
          );
          if (token) {
            await saveToken(token, Number(role), name);
            if (role == 4) {
              props.navigation.reset({
                index: 0,
                routes: [
                  {
                    name: Constants.DRAWER_NAVIGATION,
                  },
                ],
              });
            } else {
              props.navigation.reset({
                index: 0,
                routes: [
                  {
                    name: Constants.RIDER_BOTTOM_TAB,
                  },
                ],
              });
            }
          } else {
            props.navigation.reset({
              index: 0,
              routes: [
                {
                  name: Constants.LOGIN_SCREEN,
                },
              ],
            });
          }
        } catch (err) {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: Constants.LOGIN_SCREEN,
              },
            ],
          });
        }
      }, 1500);
    }, []),
  );

  return (
    <>
      <StatusBar backgroundColor={Theme.colors.appColor} />
      <View style={styles.mainContainer}>
        <View style={styles.viewMainContainer}>
          <Image source={Theme.icons.splash_Logo} />
        </View>
      </View>
    </>
  );
};

export default SplashScreen;
