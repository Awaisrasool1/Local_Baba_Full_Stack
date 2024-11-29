import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.responsiveSize.size15,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
    justifyContent: 'center',
  },
  topHeading: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.black,
    marginTop: Theme.responsiveSize.size10,
  },
  topSubHeading: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    marginBottom: Theme.responsiveSize.size10,
  },
  profileImage: {
    width: Theme.responsiveSize.size30,
    height: Theme.responsiveSize.size30,
    borderRadius: Theme.responsiveSize.size45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.responsiveSize.size10,
  },
  title: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor28,
  },
  totalRevenue: {
    fontSize: Theme.responsiveSize.size16,
    fontWeight: '700',
    marginTop: Theme.responsiveSize.size5,
    marginBottom: Theme.responsiveSize.size8,
  },
});

export default styles;
