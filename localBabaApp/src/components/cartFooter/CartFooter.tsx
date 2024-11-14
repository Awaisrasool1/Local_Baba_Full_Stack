import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import {CustomButton} from '../customButton';
import {InputText} from '../customInputText';

interface Props {
  btnTitle: string;
  type?: string;
  price?: number;
  discountedPrice?: number;
  address?: string;
  onAddress?: () => void;
  onPress: () => void;
}
const CartFooter = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.type == 'cart' && (
        <>
          <View style={styles.marginV5} />
          {!props.address && (
            <TouchableOpacity
              style={styles.addAddress}
              onPress={props.onAddress}>
              <Text style={styles.addAddressText}>Add Address</Text>
            </TouchableOpacity>
          )}
          <View style={styles.marginV5} />
          {props.address && (
            <InputText
              title="Select Delivery address"
              isEditable={false}
              value={props.address}
              numberOfLines={1}
            />
          )}
          <View style={styles.marginV5} />
        </>
      )}
      <Text style={styles.billText}>{'Total Bill'}</Text>
      <View style={styles.margin}>
        {props.type == 'cart' ? (
          <Text style={styles.priceText}>Rs: {props.price}</Text>
        ) : (
          <>
            <Text style={styles.originalPriceText}>RS: {props.price}</Text>
            <Text style={styles.priceText}>RS: {props.discountedPrice}</Text>
          </>
        )}
      </View>
      <CustomButton title={props.btnTitle} onClick={props.onPress} />
    </View>
  );
};

export default CartFooter;
