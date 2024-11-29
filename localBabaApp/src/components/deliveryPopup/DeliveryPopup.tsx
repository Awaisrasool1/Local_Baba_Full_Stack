import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import styles from './styles';
import {DeliveryCard} from '../deliveryCard';

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
              <DeliveryCard key={index} {...item} />
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
