import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Theme.responsiveSize.size10,
  },
  popupContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.responsiveSize.size10,
    padding: Theme.responsiveSize.size10,
    maxHeight: '80%',
  },
  card: {
    backgroundColor: Theme.colors.bgColor19,
    marginBottom: Theme.responsiveSize.size15,
    padding: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size10,
    shadowColor: Theme.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: Theme.responsiveSize.size3,
    elevation: Theme.responsiveSize.size2,
    width: '98%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: Theme.responsiveSize.size15,
    fontWeight: 'bold',
    marginBottom: Theme.responsiveSize.size10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.appColor,
  },
  text: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.borderColor1,
  },
  subtext: {
    fontSize: Theme.responsiveSize.size11,
    color: Theme.colors.textColor28,
  },
  info: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.textColor28,
  },
  details: {
    marginVertical: Theme.responsiveSize.size10,
  },
  detailText: {
    fontSize: Theme.responsiveSize.size12,
    marginBottom: Theme.responsiveSize.size4,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: Theme.responsiveSize.size12,
    letterSpacing: 0.7,
  },
  closeButton: {
    marginTop: Theme.responsiveSize.size15,
    alignItems: 'center',
  },
  closeText: {
    color: Theme.colors.borderColor1,
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
  },
  line: {
    width: Theme.responsiveSize.size2,
    height: Theme.responsiveSize.size30,
    backgroundColor: Theme.colors.appColor,
    marginRight: Theme.responsiveSize.size5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
