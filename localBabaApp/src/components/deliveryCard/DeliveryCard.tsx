import {View, Text, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import Theme from '../../theme/Theme';
import {CustomButton} from '../customButton';
import {Props} from './type';

const DeliveryCard = (props: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{'Delivery Details'}</Text>
      <View style={styles.row}>
        <View style={styles.flexRow}>
          <Image source={Theme.icons.vector} />
          <Text style={styles.label}>{'Pickup'}</Text>
        </View>
        <Text style={styles.info}>
          {props.pickup.distance} ~ {props.pickup.time}
        </Text>
      </View>

      <View
        style={[
          styles.flexRow,
          {
            marginLeft: Theme.responsiveSize.size5,
            marginVertical: Theme.responsiveSize.size8,
          },
        ]}>
        <View style={styles.line} />
        <View>
          <Text style={styles.text}>{props.pickup.location}</Text>
          <Text style={styles.subtext}>{props.pickup.address}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.flexRow}>
          <Image source={Theme.icons.vector} />
          <Text style={styles.label}>{'Drop-Off'}</Text>
        </View>
        <Text style={styles.info}>
          {props.dropoff.distance} ~ {props.dropoff.time}
        </Text>
      </View>

      <View
        style={[
          styles.flexRow,
          {
            marginLeft: Theme.responsiveSize.size10,
            marginVertical: Theme.responsiveSize.size8,
          },
        ]}>
        <View />
        <View>
          <Text style={styles.text}>{props.dropoff.location}</Text>
          <Text style={styles.subtext}>{props.dropoff.address}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.bold}>{'Order Id:'}</Text>
          <Text style={styles.detailText}>{props.orderId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.bold}>{'Total Bill:'}</Text>
          <Text style={styles.detailText}>{props.totalBill}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.bold}>{'Payment Method:'}</Text>
          <Text style={styles.detailText}>{'Cash On Delivery'}</Text>
        </View>
      </View>
      <CustomButton title="Accept" onClick={() => {}} />
    </View>
  );
};

export default DeliveryCard;
