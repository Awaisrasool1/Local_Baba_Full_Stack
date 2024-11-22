import {View, Text, Image} from 'react-native';
import React from 'react';
import Theme from '../../../theme/Theme';
import {CustomButton} from '../../../components';
import styles from './styles';
import {Constants} from '../../../constants';

const OrderSuccess = (props: any) => {
  const {id} = props.route.params;

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={Theme.icons.success_Order} />
      </View>
      <Text style={styles.tilte}>{'Congratulations!'}</Text>
      <Text style={styles.subTitle}>
        {'Your order has been successfully placed! 🎉'}
      </Text>
      <CustomButton
        title="Track Order"
        onClick={() =>
          props.navigation.navigate(Constants.TRACK_ORDER, {id: id})
        }
      />
    </View>
  );
};

export default OrderSuccess;
