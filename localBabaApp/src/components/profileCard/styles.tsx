import { StyleSheet } from "react-native";
import Theme from "../../theme/Theme";

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Theme.responsiveSize.size10,
        paddingHorizontal: Theme.responsiveSize.size10,
      },
      menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      menuItemText: {
        fontSize: Theme.responsiveSize.size12,
        color: Theme.colors.black,
        marginLeft: Theme.responsiveSize.size8,
      },
})

export default styles