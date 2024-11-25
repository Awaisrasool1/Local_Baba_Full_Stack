import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {CustomButton} from '../customButton';
import {InputText} from '../customInputText';
import {RadioButton} from 'react-native-paper';
import {PopUp} from '../popUp';
import Theme from '../../theme/Theme';

interface Props {
  btnTitle: string;
  type?: string;
  price?: number;
  discountedPrice?: number;
  address?: string;
  checked: boolean;
  setChecked: (i: boolean) => void;
  onAddress?: () => void;
  onPress: () => void;
}
const CartFooter = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const onCheck = async () => {
    if (!props.address) {
      props.setChecked(false);
      setIsVisible(true);
      return;
    }
    props.setChecked(!props.checked);
  };
  return (
    <View style={styles.container}>
      <View style={styles.marginV5} />
      {!props.address && (
        <TouchableOpacity style={styles.addAddress} onPress={props.onAddress}>
          <Text style={styles.addAddressText}>Add Address</Text>
        </TouchableOpacity>
      )}
      <View style={styles.flexRow}>
        <RadioButton
          color={Theme.colors.appColor}
          value="first"
          status={props.checked ? 'checked' : 'unchecked'}
          onPress={() => {
            onCheck();
          }}
        />
        <Text style={{color: Theme.colors.black}}>
          Place Order with Default Address
        </Text>
      </View>
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
      <PopUp IsVisible={isVisible} onPress={() => setIsVisible(false)} />
    </View>
  );
};

export default CartFooter;
