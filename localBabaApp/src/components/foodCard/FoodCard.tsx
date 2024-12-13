import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import Theme from '../../theme/Theme';

interface Props {
  image: any;
  name: string;
  type: string;
  time: string;
  rating: number;
  index: number;
  addToCart: () => void;
  onPress: () => void;
}
const FoodCard = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.container,
        props.index % 2 == 0
          ? {marginRight: Theme.responsiveSize.size6}
          : {marginLeft: Theme.responsiveSize.size5},
      ]}>
      <View>
        <Image style={styles.image} source={{uri: props.image}} />
        <TouchableOpacity
          style={styles.addToCartContainer}
          onPress={props.addToCart}>
          <Image source={Theme.icons.add_toCart_icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.padding}>
        <Text numberOfLines={1} style={styles.nameText}>
          {props.name}
        </Text>
        <Text style={styles.typeText}>{props.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCard;
