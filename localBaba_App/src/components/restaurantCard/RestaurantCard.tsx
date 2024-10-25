import {View, Text, Image, StyleProp, ViewStyle} from 'react-native';
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
    <View style={[styles.container,props.bgStyle]}>
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
    </View>
  );
};

export default RestaurantCard;
