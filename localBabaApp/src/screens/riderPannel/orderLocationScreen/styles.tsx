import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: Theme.responsiveSize.size1,
  },
  bottomContainer: {
    height: Theme.responsiveSize.size150,
    paddingHorizontal: Theme.responsiveSize.size10,
    backgroundColor: Theme.colors.white,
  },
  marginV10:{
    marginVertical:Theme.responsiveSize.size7
  }
});

export default styles;
