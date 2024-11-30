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
  statusContainer: {
    alignItems: 'center',
    marginBottom: Theme.responsiveSize.size15,
    paddingHorizontal: Theme.responsiveSize.size15,
  },
  bottomContainer: {
    paddingHorizontal: Theme.responsiveSize.size10,
    backgroundColor: Theme.colors.white,
    padding: Theme.responsiveSize.size10,
    borderWidth: 0.5,
    borderColor: Theme.colors.disabled,
  },
  statusText: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    marginBottom: Theme.responsiveSize.size5,
  },
  subText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor28,
  },
});

export default styles;
