import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';
import Theme from '../../theme/Theme';

interface Props {
  title: string;
  isSeeAll?: boolean;
  onPress: () => void;
}
const SeeAllBtn = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.isSeeAll && (
        <TouchableOpacity style={styles.flexRow} onPress={props.onPress}>
          <Text style={styles.seeAllText}>See All</Text>
          <Image source={Theme.icons.rightArrow} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SeeAllBtn;
