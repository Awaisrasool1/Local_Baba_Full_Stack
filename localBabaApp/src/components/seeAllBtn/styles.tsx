import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical:Theme.responsiveSize.size10
  },
  title: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.textColor26,
  },
  seeAllText: {
    fontSize: Theme.responsiveSize.size12,
    fontWeight: 'bold',
    color: Theme.colors.textColor26,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size7,
  },
});

export {styles};
