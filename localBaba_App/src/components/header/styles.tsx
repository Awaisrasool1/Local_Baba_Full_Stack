import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop:Theme.responsiveSize.size10
  },
  topHeading: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
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
  isBackText:{
    fontSize: Theme.responsiveSize.size13,
    fontWeight: 'bold',
    color: Theme.colors.black,
  }
});

export default styles;
