import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    width: '48%',
    padding: Theme.responsiveSize.size10,
    paddingLeft: Theme.responsiveSize.size15,
    borderWidth: 0.7,
    borderColor: Theme.colors.bgColor17,
    borderRadius: Theme.responsiveSize.size10,
    marginVertical: Theme.responsiveSize.size10,
    elevation: Theme.responsiveSize.size3,
  },
  todayText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor29,
  },
  countText: {
    fontSize: Theme.responsiveSize.size26,
    fontWeight: 'bold',
    color: Theme.colors.black,
  },
  titleText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor29,
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
});

export default styles;
