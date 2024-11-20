import {CustomTabNavigator, Header} from '../components';
import {OngoingOrder, OrderHistory} from '../screens';

const OrderTopTab = (props:any) => {
  const tabs = [
    {
      title: 'Home',
      content: <OngoingOrder />,
    },
    {
      title: 'Profile',
      content: <OrderHistory />,
    },
  ];

  return (
    <>
      <Header isBack isBackTitle="sad" onlyBack onBack={()=>props.navigation.goBack()}/>
      <CustomTabNavigator tabs={tabs} initialTab={0} />
    </>
  );
};

export default OrderTopTab;
