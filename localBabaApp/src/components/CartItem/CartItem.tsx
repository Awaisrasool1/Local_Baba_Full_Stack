import {View, Text, Animated, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {styles} from './styles';
import Theme from '../../theme/Theme';

interface Props {
  name: string;
  image: any;
  originalPrice: number;
  discountedPrice: number;
  itemTotalPrice: number;
  editFlag: boolean;
  index: number;
  quantity: number;
  category: string;
  onDelete: () => void;
}

const CartItem = (props: Props) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.editFlag) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 60,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [props.editFlag]);

  return (
    <View style={styles.itemWrapper}>
      <Animated.View
        style={[
          styles.deleteIconContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <TouchableOpacity onPress={props.onDelete}>
          <Image source={Theme.icons.delete_icon} />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.cartContainer,
          {
            transform: [{translateX: slideAnim}],
          },
        ]}>
        <Image source={{uri: props.image}} style={styles.cartImg} />
        <View>
          <Text style={[styles.itemText, {width: '75%'}]} numberOfLines={1}>
            {props.name}
          </Text>
          <Text style={styles.categoryText} numberOfLines={1}>
            {props.category}
          </Text>
          {props.discountedPrice !== props.originalPrice && (
            <Text style={styles.originalPriceText}>
              RS: {props.originalPrice}
            </Text>
          )}
          <Text style={styles.priceText}>RS: {props.discountedPrice}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Total: {props.itemTotalPrice}</Text>
            <View style={styles.quntityContainer}>
              <TouchableOpacity style={styles.boxContainer}>
                <Image source={Theme.icons.minus} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{props.quantity}</Text>
              <TouchableOpacity style={styles.boxContainer}>
                <Image source={Theme.icons.add} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default CartItem;
