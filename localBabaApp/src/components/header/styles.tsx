import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Theme.responsiveSize.size10,
  },
  topHeading: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
    textAlign: 'center',
  },
  topSubHeading: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
  },
  isBackText: {
    fontSize: Theme.responsiveSize.size13,
    fontWeight: 'bold',
    color: Theme.colors.black,
    letterSpacing: 0.7,
  },
  editText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.appColor,
    fontWeight: 'bold',
    letterSpacing: 0.7,
  },
});

export default styles;
