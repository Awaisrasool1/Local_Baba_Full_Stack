import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import Theme from '../../theme/Theme';

interface Props {
  title: string;
  isActive: boolean;
  onPress: () => void;
}
const CategorieCard = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.container,
        props.isActive && {backgroundColor: Theme.colors.appColor},
      ]}>
      <Text
        style={[styles.title, props.isActive && {color: Theme.colors.white}]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default CategorieCard;
