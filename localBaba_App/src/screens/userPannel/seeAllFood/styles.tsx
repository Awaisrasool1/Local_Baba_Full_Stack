import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size15,
  },
  marginV10: {
    marginVertical: Theme.responsiveSize.size10,
  },
  marginV5: {
    marginVertical: Theme.responsiveSize.size5,
  },
});

export default styles;
