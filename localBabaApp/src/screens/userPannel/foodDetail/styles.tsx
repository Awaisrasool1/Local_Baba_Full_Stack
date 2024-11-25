import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
  },
  marginV10: {
    marginVertical: Theme.responsiveSize.size10,
  },
  marginV50: {
    marginVertical: Theme.responsiveSize.size55,
  },
  marginV5: {
    marginVertical: Theme.responsiveSize.size5,
  },
  productImge: {
    width: '100%',
    height: Theme.responsiveSize.size240,
  },
  backArrow: {
    position: 'absolute',
    left: Theme.responsiveSize.size10,
    top: Theme.responsiveSize.size10,
  },
  nameText: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
    letterSpacing: 0.7,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size5,
  },
  categoryText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor2,
    letterSpacing: 0.6,
    lineHeight: Theme.responsiveSize.size15,
    marginTop: Theme.responsiveSize.size10,
  },
  ingridents: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.black,
    letterSpacing: 0.7,
    marginVertical: Theme.responsiveSize.size10,
  },
  ingridentssubText: {
    color: Theme.colors.textColor24,
    fontSize: Theme.responsiveSize.size12,
    letterSpacing: 0.7,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default styles;
