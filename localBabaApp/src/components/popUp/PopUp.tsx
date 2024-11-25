import {View, Text, Dimensions, Image} from 'react-native';
import React, {useState} from 'react';
import style from './style';
import {Overlay} from 'react-native-elements';
import {CustomButton} from '../customButton';
import Theme from '../../theme/Theme';

interface popUpProps {
  IsVisible: boolean;
  onPress: () => void;
}

export default function PopUp(props: popUpProps) {
  return (
    <Overlay isVisible={props.IsVisible}>
      <View style={style.modalContainer}>
        <Image source={Theme.icons.warningImage} style={style.image} />
        <View>
          <Text style={style.sureText}>Opps!</Text>
          <Text style={style.sybText}>
            You don't have any default shipping address :😢
          </Text>
            <CustomButton title={'Ok'} onClick={() => props.onPress()} />
        </View>
      </View>
    </Overlay>
  );
}
