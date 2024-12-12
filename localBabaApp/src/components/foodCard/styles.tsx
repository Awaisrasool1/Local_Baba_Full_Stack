import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '46%',
    backgroundColor: Theme.colors.white,
    marginTop: Theme.responsiveSize.size5,
  },
  image: {
    width: '100%',
    height: Theme.responsiveSize.size150,
    borderRadius: Theme.responsiveSize.size20,
  },
  nameText: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.black,
    fontWeight: 'bold',
  },
  typeText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor25,
    fontWeight: '500',
    marginTop: Theme.responsiveSize.size3,
  },
  padding: {
    padding: Theme.responsiveSize.size5,
    paddingLeft: Theme.responsiveSize.size10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size5,
  },
  ratingText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    fontWeight: '600',
  },
  addToCartContainer: {
    position: 'absolute',
    top: Theme.responsiveSize.size5,
    right: Theme.responsiveSize.size5,
    backgroundColor: Theme.colors.white,
    width: Theme.responsiveSize.size30,
    height: Theme.responsiveSize.size30,
    borderRadius: Theme.responsiveSize.size15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
