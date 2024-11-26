import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {isNetworkAvailable} from '../../../../api';
import {get_order_details} from '../../../../services';
import {useToast} from 'react-native-toasty-toast';
import styles from './styles';
import {formatDate} from '../../../../hooks/Hooks';
import {Header} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import Theme from '../../../../theme/Theme';

const OrderDetails = (props: any) => {
  const {id} = props.route.params;
  const {showToast} = useToast();
  const navigation: any = useNavigation();

  const {data} = useQuery<any>({
    queryKey: ['orderDetails'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return null;
        }
        const cleanOrderId = id.replace('#', '');
        const res: any = await get_order_details(cleanOrderId);
        console.log(JSON.stringify(res));
        return res.data;
      } catch (err: any) {
        console.log(err.response?.data);
        showToast(
          err.response?.data?.message || 'Error fetching profile',
          'error',
          'bottom',
          1000,
        );
        return null;
      }
    },
  });
  return (
    <ScrollView style={styles.OrderContainer}>
      <Header
        isBack
        isBackTitle="Order Summary"
        onlyBack
        onBack={() => navigation.goBack()}
      />
      <View style={styles.marginV10} />
      <View style={styles.header}>
        <Image
          source={{
            uri: data?.restaurantImage
              ? data?.restaurantImage
              : 'https://via.placeholder.com/50',
          }}
          style={styles.restaurantImage}
        />
        <Text style={styles.restaurantName}>{data?.restaurantName}</Text>
      </View>

      <View style={styles.idContainer}>
        <Image source={Theme.icons.clipBoard} />
        <Text style={styles.orderId}>Order ID: {data?.orderId}</Text>
      </View>
      <Text style={styles.placedTime}>
        <Text style={styles.activePlace}>{'Placed '}</Text>
        on {formatDate(data?.placedTime)}
      </Text>

      {data?.items?.map((val: any, index: number) => (
        <View style={styles.orderDetails} key={index}>
          <View style={styles.itemRow}>
            <Image
              source={{
                uri: val?.image ? val?.image : 'https://via.placeholder.com/50',
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>
                {val?.quantity}x {val?.name}
              </Text>
              <Text style={styles.itemPrice}>
                {'Price: '}
                {val?.price}
              </Text>
              <Text style={styles.itemPrice}>
                {'Total Price:'} {val?.totalPrice}
              </Text>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.deliveryDetails}>
        <Text style={styles.sectionTitle}>{'Delivery Details:'}</Text>
        <Text style={styles.address}>{data?.address}</Text>
      </View>
      <View style={styles.payContainer}>
        <Text style={styles.sectionTitle}>{'Payment Via Cash'}</Text>
        <Image source={Theme.icons.cash} />
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Items Price</Text>
        <Text style={styles.priceValue}>Rs: {data?.itemPrice}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Delivery Fee</Text>
        <Text style={styles.priceValue}>Rs: {data?.deliveryFee}</Text>
      </View>
      <View style={styles.priceRowTotal}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>Rs: {data?.totalPrice}</Text>
      </View>
    </ScrollView>
  );
};

export default OrderDetails;
