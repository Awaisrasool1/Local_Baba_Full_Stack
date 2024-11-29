import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Theme.responsiveSize.size10,
  },
  popupContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.responsiveSize.size10,
    padding: Theme.responsiveSize.size10,
    maxHeight: '80%',
  },
  closeButton: {
    marginTop: Theme.responsiveSize.size15,
    alignItems: 'center',
  },
  closeText: {
    color: Theme.colors.borderColor1,
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
  },
});

export default styles;
