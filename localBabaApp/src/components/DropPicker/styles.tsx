import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import Theme from '../../theme/Theme';
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  textStyleTitle: {
    fontSize: Theme.responsiveSize.size14,
    marginVertical: Theme.responsiveSize.size8,
    color: Theme.colors.black,
    textAlign: 'center',
  },
  viewLoader: {
    backgroundColor: Theme.colors.white,
    height: height / 4,
    width: width / 2,
    borderRadius: Theme.responsiveSize.size20,
    rowGap:5
  },
  textStyle: {
    fontSize: Theme.responsiveSize.size12,
    marginVertical: Theme.responsiveSize.size8,
    color: Theme.colors.black,
    textAlign: 'center',
  },
});

export default styles;
