import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:Theme.responsiveSize.size160,
    backgroundColor:Theme.colors.appColor
  },
  imageMain: {
    alignSelf: 'center',
    height: Theme.responsiveSize.size100,
    width: Theme.responsiveSize.size100,
    marginVertical: Theme.responsiveSize.size30,
  },
  bgImage:{
    position: 'absolute',
    top:0,
    right: -10,
  }
});

export {styles};
