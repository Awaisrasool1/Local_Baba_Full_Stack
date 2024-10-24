import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.responsiveSize.size20,
  },
  locationBtn: {
    width: '100%',
    marginTop: Theme.responsiveSize.size50,
    marginBottom: Theme.responsiveSize.size20,
  },
  text: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
  },
});

export {styles};
