import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  // Common
  bgStyle: {
    height: Theme.responsiveSize.size45,
    justifyContent: 'center',
    borderRadius: Theme.responsiveSize.size8,
    borderWidth: Theme.responsiveSize.size1,
    borderColor: Theme.colors.borderColor2,
    backgroundColor: Theme.colors.bgColor5,
    paddingHorizontal: Theme.responsiveSize.size15,
  },
  textStyle: {
    color: Theme.colors.textColor11,
    fontSize: Theme.responsiveSize.size16,
  },

  // New input text
  textSubTitle: {
    color: Theme.colors.textColor11,
    fontSize: Theme.responsiveSize.size11,
    fontWeight: '500',
  },
  viewBgInputText: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Theme.responsiveSize.size45,
    marginTop: Theme.responsiveSize.size3,
    backgroundColor: Theme.colors.white,
    borderColor: Theme.colors.borderColor5,
    borderWidth: Theme.responsiveSize.size1,
    borderRadius: Theme.responsiveSize.size8,
    paddingHorizontal: Theme.responsiveSize.size12,
  },
  textInput: {
    color: Theme.colors.textColor6,
    fontSize: Theme.responsiveSize.size13,
    fontWeight: '500',
  },
  textInput1: {
    color: Theme.colors.textColor6,
    fontSize: Theme.responsiveSize.size13,
    fontWeight: '500',
    paddingVertical: Theme.responsiveSize.size10,
  },
  imageIcon: {
    height: Theme.responsiveSize.size17,
    width: Theme.responsiveSize.size17,
    tintColor: Theme.colors.textColor2,
  },
  textError: {
    color: Theme.colors.textColor5,
    marginTop: Theme.responsiveSize.size2,
    fontSize: Theme.responsiveSize.size11,
    fontWeight: '400',
  },
});

export default styles;
