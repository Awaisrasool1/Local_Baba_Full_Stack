import {View, Text} from 'react-native';
import React from 'react';
import styles from './styles';

interface Props {
  count: string;
  title: string;
}
const CountBox = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.todayText}>{'Today'}</Text>
      <Text style={styles.countText}>{props.count}</Text>
      <Text style={styles.titleText}>{props.title}</Text>
    </View>
  );
};

export default CountBox;
