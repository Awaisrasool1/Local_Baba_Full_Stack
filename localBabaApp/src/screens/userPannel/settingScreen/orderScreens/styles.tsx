import {StyleSheet} from 'react-native';
import Theme from '../../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  marginV10: {
    marginVertical: Theme.responsiveSize.size10,
  },
  //order details scrren
  OrderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.responsiveSize.size10,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  restaurantImage: {
    width: Theme.responsiveSize.size45,
    height: Theme.responsiveSize.size45,
    borderRadius: Theme.responsiveSize.size25,
    marginRight: Theme.responsiveSize.size15,
  },
  restaurantName: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
    paddingHorizontal: Theme.responsiveSize.size15,
  },
  orderId: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    marginTop: Theme.responsiveSize.size3,
    fontWeight: '600',
  },
  placedTime: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor2,
    paddingHorizontal: Theme.responsiveSize.size15,
    marginTop: Theme.responsiveSize.size5,
  },
  activePlace: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor9,
  },
  orderDetails: {
    marginBottom: Theme.responsiveSize.size5,
    marginTop: Theme.responsiveSize.size10,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: Theme.responsiveSize.size40,
    height: Theme.responsiveSize.size40,
    borderRadius: Theme.responsiveSize.size8,
    marginRight: Theme.responsiveSize.size10,
  },
  payContainer: {
    height: Theme.responsiveSize.size30,
    backgroundColor: '#F6F8FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size20,
    paddingLeft: Theme.responsiveSize.size10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: Theme.responsiveSize.size11,
    fontWeight: 'bold',
    color: Theme.colors.black,
  },
  itemPrice: {
    fontSize: Theme.responsiveSize.size11,
    color: '#555',
    marginTop: Theme.responsiveSize.size3,
  },
  deliveryDetails: {
    marginBottom: Theme.responsiveSize.size10,
    marginTop: Theme.responsiveSize.size10,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  sectionTitle: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
    marginBottom: Theme.responsiveSize.size4,
  },
  address: {
    fontSize:  Theme.responsiveSize.size11,
    color: '#555',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: Theme.responsiveSize.size10,
    marginTop: Theme.responsiveSize.size10,
  },
  priceRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.responsiveSize.size10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: Theme.responsiveSize.size10,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  priceLabel: {
    fontSize: Theme.responsiveSize.size12,
    color: '#555',
  },
  priceValue: {
    fontSize: Theme.responsiveSize.size12,
    color: '#555',
  },
  totalLabel: {
    fontSize: Theme.responsiveSize.size12,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: Theme.responsiveSize.size12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default styles;
