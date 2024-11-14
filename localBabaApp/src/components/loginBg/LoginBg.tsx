import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Theme from '../../theme/Theme';
import {styles} from './styles';

interface Props {
  isTitle?: boolean;
  onBack?: () => void;
}
const LoginBg = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.isTitle ? (
        <>
          <TouchableOpacity onPress={props.onBack} style={styles.backArrow}>
            <Image source={Theme.icons.leftArrowBg} />
          </TouchableOpacity>
          <View style={styles.signUpTextContainer}>
            <Text style={styles.signUpText}>{'Sign Up'}</Text>
            <Text style={styles.signUpSubText}>
              {'Please sign up to get started'}
            </Text>
          </View>
        </>
      ) : (
        <Image
          source={Theme.icons.splash_Logo}
          style={styles.imageMain}
          resizeMode={'contain'}
        />
      )}
      <Image
        source={Theme.icons.loginBgImage}
        resizeMode={'contain'}
        style={styles.bgImage}
      />
      <Image
        source={Theme.icons.loginBgImage1}
        resizeMode={'contain'}
        style={[styles.bgImage, {left: 0}]}
      />
    </View>
  );
};

export default LoginBg;
