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
  backArrow: {
    position: 'absolute',
    top: Theme.responsiveSize.size10,
    left: Theme.responsiveSize.size10,
  },
  ///   See All Address Screen ///

  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
  },
  scrollContent: {
    padding: Theme.responsiveSize.size10,
  },
  paddingH10: {
    paddingHorizontal: Theme.responsiveSize.size10,
    paddingTop: Theme.responsiveSize.size5,
    paddingBottom: Theme.responsiveSize.size5,
  },
  card: {
    backgroundColor: Theme.colors.bgColor7,
    borderRadius: Theme.responsiveSize.size10,
    padding: Theme.responsiveSize.size10,
    marginBottom: Theme.responsiveSize.size10,
    shadowColor: Theme.colors.black,
    shadowOffset: {
      width: 0,
      height: Theme.responsiveSize.size2,
    },
    shadowOpacity: 0.1,
    shadowRadius: Theme.responsiveSize.size1,
    elevation: Theme.responsiveSize.size2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.responsiveSize.size5,
  },
  margin: {
    marginTop: Theme.responsiveSize.size2,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: Theme.responsiveSize.size12,
    fontWeight: '600',
    color: Theme.colors.black,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: Theme.responsiveSize.size12,
    color: '#666',
  },
});

export default styles;
