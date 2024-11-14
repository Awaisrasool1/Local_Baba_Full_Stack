import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: Theme.colors.appColor,
  },
  viewContainer: {
    flex: 1,
  },
  viewCenter: {
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  textTitle: {
    color: Theme.colors.textColor11,
    fontSize: Theme.responsiveSize.size25,
    fontWeight: 'bold',
  },
  marginV8: {
    marginVertical: Theme.responsiveSize.size8,
  },
  marginV5: {
    marginVertical: Theme.responsiveSize.size5,
  },
  viewButton: {
    marginVertical: Theme.responsiveSize.size15,
    marginHorizontal: Theme.responsiveSize.size15,
  },
  dontText: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.textColor16,
    textAlign: 'center',
  },
  SignUpText: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.black,
    fontWeight: 'bold',
  },
});

export {styles};
