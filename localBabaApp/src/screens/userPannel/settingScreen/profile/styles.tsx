import {StyleSheet} from 'react-native';
import Theme from '../../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
  },
  paddingH10: {
    paddingHorizontal: Theme.responsiveSize.size10,
    paddingTop: Theme.responsiveSize.size10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.responsiveSize.size15,
    marginBottom: Theme.responsiveSize.size15,
    gap: Theme.responsiveSize.size30,
  },
  profileImage: {
    width: Theme.responsiveSize.size70,
    height: Theme.responsiveSize.size70,
    borderRadius: Theme.responsiveSize.size45,
    marginBottom: Theme.responsiveSize.size10,
  },
  name: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
    marginBottom: Theme.responsiveSize.size5,
  },
});

export default styles;
