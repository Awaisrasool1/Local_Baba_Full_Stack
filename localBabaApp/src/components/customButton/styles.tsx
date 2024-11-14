import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  viewMain: {
    paddingHorizontal: Theme.responsiveSize.size20,
    paddingVertical: Theme.responsiveSize.size10,
    borderTopLeftRadius: Theme.responsiveSize.size15,
    borderTopRightRadius: Theme.responsiveSize.size15,
    backgroundColor: Theme.colors.bgColor2,
    shadowColor: Theme.colors.bgColor1,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 15,
  },
  // Common
  bgStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.responsiveSize.size8,
    backgroundColor: Theme.colors.appColor,
    paddingVertical: Theme.responsiveSize.size10,
  },
  viewSvg: {
    height: Theme.responsiveSize.size18,
    width: Theme.responsiveSize.size18,
    marginRight: Theme.responsiveSize.size5,
  },
  textStyle: {
    color: Theme.colors.textColor1,
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '700',
    // fontFamily: Theme.fontFamily.fontInterMedium,
  },
  image:{
   marginLeft:Theme.responsiveSize.size10
  },
  
});

export default styles;
