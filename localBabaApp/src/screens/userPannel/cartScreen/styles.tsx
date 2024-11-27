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
  marginV60: {
    marginVertical: Theme.responsiveSize.size100,
  },
  marginV5: {
    marginVertical: Theme.responsiveSize.size5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  notFound:{
    fontSize:Theme.responsiveSize.size14,
    color:Theme.colors.black,
    textAlign: 'center',
    marginTop: Theme.responsiveSize.size50,
  }
});

export default styles;
