import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    padding: Theme.responsiveSize.size10,
    width: '100%',
    marginTop: Theme.responsiveSize.size50,
  },
  stepContainer: {
    marginBottom: Theme.responsiveSize.size55,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  circle: {
    width: Theme.responsiveSize.size40,
    height: Theme.responsiveSize.size40,
    borderRadius: Theme.responsiveSize.size10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.responsiveSize.size10,
  },
  dot: {
    width: Theme.responsiveSize.size10,
    height: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size5,
  },
  icon: {
    width: Theme.responsiveSize.size15,
    height: Theme.responsiveSize.size15,
  },
  line: {
    position: 'absolute',
    left: Theme.responsiveSize.size17,
    top: Theme.responsiveSize.size48,
    width: Theme.responsiveSize.size3,
    height: Theme.responsiveSize.size40,
    backgroundColor: Theme.colors.disabled,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 4,
  },
  activeTitle: {
    color: Theme.colors.appColor,
  },
  completedTitle: {
    color: Theme.colors.appColor,
  },
  description: {
    fontSize: Theme.responsiveSize.size12,
    color: '#9E9E9E',
  },
});

export default styles;
