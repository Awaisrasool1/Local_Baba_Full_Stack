import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  card: {
    marginBottom: Theme.responsiveSize.size15,
    padding: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size10,
    borderWidth: 0.4,
    borderColor: Theme.colors.appColor,
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
