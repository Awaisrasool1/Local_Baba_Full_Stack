import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from './styles';
import Theme from '../../theme/Theme';
import {CustomButton} from '../customButton';

interface Props {
  isVisible: boolean;
  setIsVisible: (i: boolean) => void;
}
const DeliveryPopup = (props: Props) => {
  const deliveryItems = [
    {
      orderId: '1234579785',
      totalBill: '$123.44',
      paymentMethod: 'Cash On Delivery',
      pickup: {
        location: 'Pizza Hut',
        address: 'Street # 141 Delhi',
        distance: '3.4km',
        time: '10 min',
      },
      dropoff: {
        location: 'House # 121',
        address: 'Street # 141 Delhi',
        distance: '3.4km',
        time: '10 min',
      },
    },
    {
      orderId: '1234579786',
      totalBill: '$98.76',
      paymentMethod: 'Credit Card',
      pickup: {
        location: 'KFC',
        address: 'Street # 50 Delhi',
        distance: '2.1km',
        time: '5 min',
      },
      dropoff: {
        location: 'Apartment # 34',
        address: 'Street # 50 Delhi',
        distance: '2.1km',
        time: '5 min',
      },
    },
  ];

  return (
    <Modal visible={props.isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ScrollView>
            {deliveryItems.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.sectionTitle}>{'Delivery Details'}</Text>
                <View style={styles.row}>
                  <View style={styles.flexRow}>
                    <Image source={Theme.icons.vector} />
                    <Text style={styles.label}>{'Pickup'}</Text>
                  </View>
                  <Text style={styles.info}>
                    {item.pickup.distance} ~ {item.pickup.time}
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
                    <Text style={styles.text}>{item.pickup.location}</Text>
                    <Text style={styles.subtext}>{item.pickup.address}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.flexRow}>
                    <Image source={Theme.icons.vector} />
                    <Text style={styles.label}>{'Drop-Off'}</Text>
                  </View>
                  <Text style={styles.info}>
                    {item.dropoff.distance} ~ {item.dropoff.time}
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
                    <Text style={styles.text}>{item.dropoff.location}</Text>
                    <Text style={styles.subtext}>{item.dropoff.address}</Text>
                  </View>
                </View>

                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Text style={styles.bold}>{'Order Id:'}</Text>
                    <Text style={styles.detailText}>{item.orderId}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.bold}>{'Total Bill:'}</Text>
                    <Text style={styles.detailText}>{item.totalBill}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.bold}>{'Payment Method:'}</Text>
                    <Text style={styles.detailText}>{item.paymentMethod}</Text>
                  </View>
                </View>
                <CustomButton title="Accept" onClick={() => {}} />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => props.setIsVisible(false)}>
            <Text style={styles.closeText}>{'CANCEL'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeliveryPopup;
