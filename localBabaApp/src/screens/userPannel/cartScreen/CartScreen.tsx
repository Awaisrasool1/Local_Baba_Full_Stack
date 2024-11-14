import {View, ScrollView, ActivityIndicator, Text} from 'react-native';
import React, {useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import styles from './styles';
import {CartFooter, CartItem, Header} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {get_cart_item, get_default_address} from '../../../services';
import {useToast} from 'react-native-toasty-toast';
import {AddressData, CartData} from './types';
import {Constants} from '../../../constants';
import {useIsFocused} from '@react-navigation/native';

const CartScreen = (props: any) => {
  const {showToast} = useToast();
  const [editFlag, setEditFlag] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>();
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const {data} = useQuery<CartData[]>({
    queryKey: ['cartItem'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return;
        }
        const res = await get_cart_item();
        setTotalPrice(res?.totalPrice);
        return res.data;
      } catch (err: any) {
        console.log(err.response.data.message);
        showToast(err.response.data.message, 'error', 'bottom', 1000);
      }
    },
    enabled: isFocused,
  });

  const {data: defaultAddress} = useQuery<AddressData>({
    queryKey: ['defaultAddress'],
    queryFn: async () => {
      try {
        const isConnected = await isNetworkAvailable();
        if (!isConnected) {
          showToast('Check your internet!', 'error', 'bottom', 1000);
          return;
        }
        const res = await get_default_address();
        return res.data;
      } catch (err: any) {
        console.log(err.response.data.message);
        showToast(err.response.data.message, 'error', 'bottom', 1000);
      }
    },
    enabled: isFocused,
  });

  const handleDelete = async (itemId: string) => {
    queryClient.setQueryData<CartData[]>(
      ['cartItem'],
      oldData => oldData?.filter(item => item.id !== itemId) ?? [],
    );
    queryClient.invalidateQueries({queryKey: ['cartItem']});
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.marginV10}>
          <Header
            isBack
            isBackTitle="Your Cart"
            isEdit={editFlag}
            onEdit={() => setEditFlag(!editFlag)}
            onBack={() => props.navigation.goBack()}
          />
        </View>
        <ScrollView>
          {data?.map((item: CartData, index: number) => (
            <CartItem
              key={item.id}
              name={item.name}
              originalPrice={item.originalPrice}
              discountedPrice={item.discountedPrice}
              itemTotalPrice={item.itemTotalPrice}
              image={item.image}
              editFlag={editFlag}
              category={item.category}
              quantity={item.quantity}
              index={index}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
          <View style={styles.marginV60} />
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <CartFooter
          address={defaultAddress?.fullAddress}
          price={totalPrice}
          type={'cart'}
          btnTitle={'By Now'}
          onAddress={() => props.navigation.navigate(Constants.ADDRESS_SCREEN)}
          onPress={() => {}}
        />
      </View>
    </>
  );
};

export default CartScreen;
