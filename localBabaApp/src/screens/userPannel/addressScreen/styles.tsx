import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerTooltip: {
    backgroundColor: Theme.colors.black,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  tooltipText: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    padding: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
    marginHorizontal: Theme.responsiveSize.size20,
    marginBottom: Theme.responsiveSize.size10,
  },
  addressInput: {
    flex: 1,
    marginLeft: Theme.responsiveSize.size10,
    fontSize: Theme.responsiveSize.size16,
    color: Theme.colors.black,
  },
  saveButton: {
    backgroundColor: Theme.colors.appColor,
    paddingVertical: Theme.responsiveSize.size12,
    paddingHorizontal: Theme.responsiveSize.size50,
    borderRadius: Theme.responsiveSize.size8,
    marginBottom: Theme.responsiveSize.size30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  saveButtonText: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size16,
    fontWeight: '600',
  },
  backArrow:{
    position: 'absolute',
    top:Theme.responsiveSize.size10,
    left:Theme.responsiveSize.size10
  }
});

export default styles;
