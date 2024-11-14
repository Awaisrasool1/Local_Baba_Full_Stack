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
  MorningText: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
  },
  userNmae: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.black,
  },
  noDataText: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.black,
    fontWeight: 'bold',
    marginTop: Theme.responsiveSize.size10,
    marginLeft: Theme.responsiveSize.size10,
  },
});

export default styles;
