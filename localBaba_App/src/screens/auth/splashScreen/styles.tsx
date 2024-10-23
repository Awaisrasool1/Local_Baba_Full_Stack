import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: Theme.colors.appColor,
  },
  viewMainContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.responsiveSize.size20,
  },
  image: {
    height: Theme.responsiveSize.size150,
    width: Theme.responsiveSize.size150,
  },
});

export default styles;
