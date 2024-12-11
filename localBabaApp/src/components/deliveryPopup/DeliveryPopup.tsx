import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import styles from './styles';
import {DeliveryCard} from '../deliveryCard';
import {useNavigation} from '@react-navigation/native';
import {Constants} from '../../constants';
import {order_assigned} from '../../services';

interface Props {
  isVisible: boolean;
  data: any[];
  onPress: () => void;
  setIsOnline: (i: boolean) => void;
  setVisible: (i: boolean) => void;
}
const DeliveryPopup = (props: Props) => {
  const nav: any = useNavigation();

  const sendData = async (item: any) => {
    try {
      let data = {
        id: item.orderId,
      };
      const res = await order_assigned(data);
      console.log('res', res);
      props.setIsOnline(false);
      props.setVisible(false);
      nav.navigate(Constants.ORDER_LOCATION_SCREEN, {
        orderId: item.orderId,
        restData: {
          RestAddress: item.pickup.address,
          locationRest: item.pickup.restaurantLocation,
        },
        userData: {
          userAddress: item.dropoff.address,
          userLocation: item.dropoff.userLocation,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal visible={props.isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ScrollView>
            {props.data?.map((item, index) => (
              <DeliveryCard
                key={index}
                {...item}
                onAccept={() => {
                  sendData(item);
                }}
              />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={props.onPress}>
            <Text style={styles.closeText}>{'CANCEL'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeliveryPopup;
