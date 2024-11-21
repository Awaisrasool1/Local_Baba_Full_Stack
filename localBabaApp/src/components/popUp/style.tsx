import {Dimensions, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const windowWidth = Dimensions.get('window').width;

const style = StyleSheet.create({
  modalContainer: {
    width: windowWidth / 1.2,
    minHeight: windowWidth / 1.2,
  },
  modalInnerContainer: {
    height: Theme.responsiveSize.size55,
    backgroundColor: Theme.colors.black,
    width: windowWidth / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sureText: {
    fontSize: Theme.responsiveSize.size16,
    fontWeight: '700',
    color: Theme.colors.black,
    textAlign: 'center',
  },
  sybText: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '500',
    marginTop: Theme.responsiveSize.size10,
    textAlign:'center',
    marginBottom: Theme.responsiveSize.size20,
  },
  image:{
    width: windowWidth / 1.5,
    height: Theme.responsiveSize.size190,
    resizeMode:'center',
    alignSelf:'center'
  }
});

export default style;
