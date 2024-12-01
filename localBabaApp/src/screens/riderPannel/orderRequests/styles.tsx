import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  marginV10: {
    marginVertical: Theme.responsiveSize.size10,
  },
  marginV5: {
    marginVertical: Theme.responsiveSize.size5,
  },
});

export default styles;
