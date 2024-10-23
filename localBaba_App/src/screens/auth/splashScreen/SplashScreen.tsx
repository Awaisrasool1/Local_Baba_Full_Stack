import React, {useCallback, useEffect} from 'react';
import {Image, StatusBar, View} from 'react-native';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import Theme from '../../../theme/Theme';

const SplashScreen = (props: any) => {
  useFocusEffect(useCallback(() => {}, []));

  return (
    <>
      <StatusBar hidden />
      <View style={styles.mainContainer}>
        <View style={styles.viewMainContainer}></View>
      </View>
    </>
  );
};

export default SplashScreen;
