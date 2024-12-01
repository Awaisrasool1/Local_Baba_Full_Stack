import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';

interface Props {
  count: string;
  title: string;
  isDisabled: boolean;
  onPress?: () => void;
}
const CountBox = (props: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      disabled={props.isDisabled}
      onPress={props.onPress}>
      <Text style={styles.todayText}>{'Today'}</Text>
      <Text style={styles.countText}>{props.count}</Text>
      <Text style={styles.titleText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default CountBox;
