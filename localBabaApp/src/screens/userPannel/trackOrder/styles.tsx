import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size10,
  },

  //order success
  image:{
  marginTop:Theme.responsiveSize.size50,
  alignItems: 'center'
  },
  tilte: {
    fontSize: Theme.responsiveSize.size16,
    color: Theme.colors.black,
    marginTop: Theme.responsiveSize.size30,
    marginVertical: Theme.responsiveSize.size10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.disabled,
    marginBottom: Theme.responsiveSize.size25,
    textAlign: 'center',
  },
});

export default styles;
