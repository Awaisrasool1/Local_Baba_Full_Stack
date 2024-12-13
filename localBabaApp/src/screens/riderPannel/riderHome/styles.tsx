import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size15,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
    justifyContent: 'center',
  },
  topHeading: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
    marginTop: Theme.responsiveSize.size10,
  },
  topSubHeading: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    marginBottom: Theme.responsiveSize.size10,
  },
  profileImage: {
    width: Theme.responsiveSize.size30,
    height: Theme.responsiveSize.size30,
    borderRadius: Theme.responsiveSize.size45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.responsiveSize.size10,
  },
  title: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor28,
  },
  totalRevenue: {
    fontSize: Theme.responsiveSize.size16,
    fontWeight: '700',
    marginTop: Theme.responsiveSize.size5,
    marginBottom: Theme.responsiveSize.size8,
  },
  label: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '500',
    color: Theme.colors.appColor,
  },
  boxDeliveredContainer: {
    borderBottomWidth: 0.6,
    borderColor: Theme.colors.textColor8,
    paddingVertical: Theme.responsiveSize.size10,
  },
  info: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor28,
    marginLeft: Theme.responsiveSize.size16,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size5,
  },
  restName: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
  },
  boxLine: {
    width: Theme.responsiveSize.size1,
    height: Theme.responsiveSize.size30,
    backgroundColor: Theme.colors.black,
    borderRadius: Theme.responsiveSize.size2,
    position: 'absolute',
    top: -20,
    left: Theme.responsiveSize.size5,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryBox: {
    width: Theme.responsiveSize.size50,
    height: Theme.responsiveSize.size20,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.responsiveSize.size5,
  },
});

export default styles;
