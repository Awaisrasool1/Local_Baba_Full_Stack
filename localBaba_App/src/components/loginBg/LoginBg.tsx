import {View, Text, Image} from 'react-native';
import React from 'react';
import Theme from '../../theme/Theme';
import {styles} from './styles';

const LoginBg = () => {
  return (
    <View style={styles.container}>
      <Image
        source={Theme.icons.splash_Logo}
        style={styles.imageMain}
        resizeMode={'contain'}
      />
      <Image
        source={Theme.icons.loginBgImage}
        resizeMode={'contain'}
        style={styles.bgImage}
      />
      <Image
        source={Theme.icons.loginBgImage1}
        resizeMode={'contain'}
        style={[styles.bgImage,{left:0}]}
      />
    </View>
  );
};

export default LoginBg;
