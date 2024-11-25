import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Theme.responsiveSize.size160,
    backgroundColor: Theme.colors.appColor,
  },
  backArrow: {
    position: 'absolute',
    zIndex: 2,
    left: Theme.responsiveSize.size10,
    top: Theme.responsiveSize.size10,
  },
  imageMain: {
    alignSelf: 'center',
    height: Theme.responsiveSize.size100,
    width: Theme.responsiveSize.size100,
    marginVertical: Theme.responsiveSize.size30,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    right: -10,
  },
  signUpTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  signUpText: {
    fontSize: Theme.responsiveSize.size16,
    color: Theme.colors.white,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  signUpSubText: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.white,
    letterSpacing: 0.6,
    marginTop: Theme.responsiveSize.size3,
  },
});

export {styles};
