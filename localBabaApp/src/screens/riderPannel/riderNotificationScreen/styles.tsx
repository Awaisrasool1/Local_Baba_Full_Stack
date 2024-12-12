import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Theme.colors.white,
  },
  topTitie: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.black,
    fontWeight: 'bold',
    marginTop: Theme.responsiveSize.size10,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  boxContainer: {
    borderBottomWidth: 0.6,
    borderColor: Theme.colors.textColor8,
    paddingVertical: Theme.responsiveSize.size10,
  },
  line: {
    width: '100%',
    backgroundColor: Theme.colors.bgColor17,
    height: Theme.responsiveSize.size1,
    marginVertical: Theme.responsiveSize.size10,
  },
  padding: {
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size5,
  },
  userName: {
    fontSize: Theme.responsiveSize.size13,
    fontWeight: '500',
    left: 0.7,
    color: Theme.colors.black,
    marginBottom: Theme.responsiveSize.size5,
  },
  subText: {
    fontSize: Theme.responsiveSize.size13,
    left: 0.7,
    fontWeight: '400',
    color: Theme.colors.textColor30,
  },
  box: {
    width: Theme.responsiveSize.size10,
    height: Theme.responsiveSize.size10,
    backgroundColor: Theme.colors.black,
    borderRadius: Theme.responsiveSize.size5,
  },
  restName: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
  },
  boxLine: {
    width: Theme.responsiveSize.size2,
    height: Theme.responsiveSize.size20,
    backgroundColor: Theme.colors.black,
    borderRadius: Theme.responsiveSize.size2,
    marginLeft: Theme.responsiveSize.size3,
  },
});

export default styles;
