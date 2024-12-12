import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

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
  email: {
    fontSize: Theme.responsiveSize.size12,
    color: '#666',
    marginBottom: Theme.responsiveSize.size5,
  },
  phone: {
    fontSize: Theme.responsiveSize.size12,
    color: '#666',
  },
  section: {
    backgroundColor: Theme.colors.bgColor7,
    borderRadius: Theme.responsiveSize.size10,
    marginHorizontal: Theme.responsiveSize.size10,
    marginBottom: Theme.responsiveSize.size15,
    padding: Theme.responsiveSize.size5,
    shadowColor: Theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: Theme.responsiveSize.size1,
    elevation: Theme.responsiveSize.size1,
  },
  editImage: {
    width: Theme.responsiveSize.size90,
    height: Theme.responsiveSize.size90,
    borderRadius: Theme.responsiveSize.size45,
    marginBottom: Theme.responsiveSize.size10,
  },
  editText: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.black,
  },
  itemCener: {
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: Theme.responsiveSize.size5,
    right: 0,
  },
  marginTop:{
    marginTop:Theme.responsiveSize.size10,
  }
});

export default styles;
