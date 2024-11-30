import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import styles from './styles';
import {DeliveryCard} from '../deliveryCard';

interface Props {
  isVisible: boolean;
  data: any[];
  onPress: () => void;
}
const DeliveryPopup = (props: Props) => {
  return (
    <Modal visible={props.isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ScrollView>
            {props.data?.map((item, index) => (
              <DeliveryCard key={index} {...item} />
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
