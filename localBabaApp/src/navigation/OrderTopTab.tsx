import {StyleSheet, View} from 'react-native';
import {CustomTabNavigator, Header} from '../components';
import {OngoingOrder, OrderHistory} from '../screens';
import Theme from '../theme/Theme';

const OrderTopTab = (props: any) => {
  const tabs = [
    {
      title: 'Ongoing',
      content: <OngoingOrder />,
    },
    {
      title: 'History',
      content: <OrderHistory />,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <Header
          isBack
          isBackTitle="My Orders"
          onlyBack
          onBack={() => props.navigation.goBack()}
        />
      </View>
      <CustomTabNavigator tabs={tabs} initialTab={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.white,
  },
  padding: {
    paddingHorizontal: Theme.responsiveSize.size10,
    marginTop: Theme.responsiveSize.size5,
  },
 
});
export default OrderTopTab;
