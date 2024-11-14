import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  deleteIconContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  cartContainer: {
    flexDirection: 'row',
    marginVertical: Theme.responsiveSize.size10,
    gap: Theme.responsiveSize.size10,
  },
  cartImg: {
    width: Theme.responsiveSize.size100,
    height: Theme.responsiveSize.size100,
    borderRadius: Theme.responsiveSize.size10,
  },
  itemText: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
  },
  priceText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    fontWeight: '500',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '75%',
  },
  quntityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
  },
  boxContainer: {
    backgroundColor: Theme.colors.bgColor7,
    width: Theme.responsiveSize.size25,
    height: Theme.responsiveSize.size25,
    borderRadius: Theme.responsiveSize.size15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  originalPriceText: {
    fontSize: 14,
    color: Theme.colors.disabled,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  categoryText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    marginTop: Theme.responsiveSize.size5,
    marginBottom: Theme.responsiveSize.size5,
  },
});

export {styles};
