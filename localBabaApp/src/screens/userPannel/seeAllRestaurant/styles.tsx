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
  noDataText:{
    fontSize:Theme.responsiveSize.size16,
    color:Theme.colors.black,
    fontWeight:'bold',
    marginTop:Theme.responsiveSize.size10,
    textAlign:'center'
  }
});

export default styles;
