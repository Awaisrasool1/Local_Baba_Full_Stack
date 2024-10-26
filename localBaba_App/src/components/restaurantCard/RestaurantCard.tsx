import {
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import styles from './styles';
import Theme from '../../theme/Theme';

interface Props {
  image: any;
  name: string;
  serviesType: string;
  rating: number;
  onPress: () => void;

  bgStyle?: StyleProp<ViewStyle>;
}
const RestaurantCard = (props: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.bgStyle]}
      onPress={props.onPress}>
      <Image source={{uri: props?.image}} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.nameText}>
          {props.name}
        </Text>
        <Text style={styles.typeText}>{props.serviesType}</Text>
        <View style={styles.flexRow}>
          <Image source={Theme.icons.star} />
          <Text style={styles.typeText}>{props.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
