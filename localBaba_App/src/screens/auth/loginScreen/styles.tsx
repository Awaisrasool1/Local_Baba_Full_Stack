import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: Theme.colors.white,
  },
  viewContainer: {
    flex: 1,
  },
  imageMain: {
    alignSelf: 'center',
    height: Theme.responsiveSize.size80,
    width: Theme.responsiveSize.size80,
    marginVertical: Theme.responsiveSize.size30,
  },
  viewCenter: {
    paddingHorizontal: Theme.responsiveSize.size15,
    marginTop: Theme.responsiveSize.size55,
    paddingBottom: Theme.responsiveSize.size60,
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
  }
});

export default styles;
