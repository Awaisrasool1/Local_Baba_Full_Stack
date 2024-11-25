import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.responsiveSize.size5,
    padding: Theme.responsiveSize.size10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: Theme.responsiveSize.size10,
    shadowOffset: {width: 0, height: 5},
    elevation: Theme.responsiveSize.size2,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '99%',
  },
  title: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '500',
    marginBottom: Theme.responsiveSize.size5,
    width: '78%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: Theme.responsiveSize.size60,
    height: Theme.responsiveSize.size60,
    borderRadius: Theme.responsiveSize.size8,
    marginRight: Theme.responsiveSize.size10,
  },
  info: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurant: {
    fontSize: Theme.responsiveSize.size12,
    fontWeight: '600',
  },
  orderId: {
    fontSize: Theme.responsiveSize.size12,
    color: '#888',
  },
  details: {
    fontSize: Theme.responsiveSize.size12,
    color: '#444',
    marginVertical: Theme.responsiveSize.size5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackButton: {
    backgroundColor: Theme.colors.appColor,
    paddingVertical: Theme.responsiveSize.size8,
    paddingHorizontal: Theme.responsiveSize.size15,
    borderRadius: Theme.responsiveSize.size5,
  },
  trackText: {
    color: Theme.colors.white,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  cancelButton: {
    borderColor: Theme.colors.appColor,
    borderWidth: Theme.responsiveSize.size1,
    paddingVertical: Theme.responsiveSize.size6,
    paddingHorizontal: Theme.responsiveSize.size15,
    borderRadius: Theme.responsiveSize.size5,
  },
  cancelText: {
    color: Theme.colors.appColor,
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.bgColor1,
    fontWeight: '600',
    letterSpacing: 0.6,
    textAlign:'right',
    marginTop: Theme.responsiveSize.size10,
  },
});

export default styles;
