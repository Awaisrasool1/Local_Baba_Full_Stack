import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: Theme.responsiveSize.size90,
    height: Theme.responsiveSize.size35,
    backgroundColor: Theme.colors.white,
    elevation: Theme.responsiveSize.size3,
    margin: Theme.responsiveSize.size5,
    borderRadius: Theme.responsiveSize.size20,
    alignItems:'center',
    justifyContent:'center',
  },
  title:{
    fontSize:Theme.responsiveSize.size13,
    fontWeight:'bold',
    color:Theme.colors.black
  }
});

export default styles;
