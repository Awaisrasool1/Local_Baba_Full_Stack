import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: Theme.responsiveSize.size240,
    padding: Theme.responsiveSize.size5,
    backgroundColor: Theme.colors.white,
  },
  image: {
    width: '100%',
    height: Theme.responsiveSize.size140,
    borderRadius: Theme.responsiveSize.size20,
  },
  contentContainer: {
    padding: Theme.responsiveSize.size5,
    paddingLeft: Theme.responsiveSize.size10,
  },
  nameText: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.black,
    fontWeight: 'bold',
  },
  typeText:{
    fontSize:Theme.responsiveSize.size12,
    color:Theme.colors.textColor25,
    fontWeight:'500'
  },
  flexRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:Theme.responsiveSize.size4,
    marginTop:Theme.responsiveSize.size5
  }
});

export default styles;
