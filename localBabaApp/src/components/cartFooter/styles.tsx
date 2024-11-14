import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopColor: Theme.colors.textColor27,
    borderLeftColor: Theme.colors.textColor27,
    borderRightColor: Theme.colors.textColor27,
    borderTopLeftRadius: Theme.responsiveSize.size20,
    borderTopRightRadius: Theme.responsiveSize.size20,
    padding: Theme.responsiveSize.size10,
    elevation: Theme.responsiveSize.size5,
    backgroundColor: Theme.colors.white,
  },
  billText: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.textColor24,
    fontWeight: '600',
  },
  priceText: {
    fontSize: Theme.responsiveSize.size15,
    color: Theme.colors.black,
    fontWeight: '700',
  },
  originalPriceText: {
    fontSize: 14,
    color: Theme.colors.disabled,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  margin: {
    marginTop: Theme.responsiveSize.size5,
    marginBottom: Theme.responsiveSize.size10,
  },
  marginV5:{
    marginVertical:Theme.responsiveSize.size5
  },
  marginV10:{
    marginVertical:Theme.responsiveSize.size10
  },
  addAddress: {
    backgroundColor: Theme.colors.appColor,
    width: Theme.responsiveSize.size100,
    height: Theme.responsiveSize.size30,
    borderRadius: Theme.responsiveSize.size20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: Theme.responsiveSize.size10,
    top: Theme.responsiveSize.size10,
  },
  addAddressText:{
    fontSize:Theme.responsiveSize.size12,
    color:Theme.colors.white,
    fontWeight:'500',
  }
});

export default styles;
