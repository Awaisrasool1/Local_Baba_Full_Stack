import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import styles from './styles';

interface OrderCardProps {
  restaurant: string;
  name: string;
  image: string;
  price: number;
  items: number;
  orderId: string;
  onTrackOrder: () => void;
  onCancel: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  restaurant,
  image,
  name,
  price,
  items,
  orderId,
  onTrackOrder,
  onCancel,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.flexRow}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.orderId}>{orderId}</Text>
      </View>
      <View style={styles.content}>
        <Image source={{uri: image}} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.restaurant}>{restaurant}</Text>
          </View>
          <Text style={styles.details}>
            <Text style={[styles.details, {fontWeight: 'bold'}]}>
              RS {price}
            </Text>{' '}
            | {items} Items
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.trackButton} onPress={onTrackOrder}>
              <Text style={styles.trackText}>{'Track Order'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
