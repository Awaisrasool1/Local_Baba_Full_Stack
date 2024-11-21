import {View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import styles from './styles';
import {CartFooter, CartItem, Header} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {
  add_quantity,
  delete_cart_item,
  get_cart_item,
  get_default_address,
  place_order_By_Cart,
  remove_quantity,
} from '../../../services';
import {useToast} from 'react-native-toasty-toast';
import {AddressData, CartData, Location} from './types';
import {Constants} from '../../../constants';
import {useIsFocused} from '@react-navigation/native';
import {checkPermission} from '../../../api/api';
import GetLocation from 'react-native-get-location';

const CartScreen = (props: any) => {
  const {showToast} = useToast();
  const [editFlag, setEditFlag] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>();
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const [checked, setChecked] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    GetCurrentLocation();
  }, []);

  const GetCurrentLocation = async () => {
    const result = await checkPermission('location');
    if (result.result) {
      const currentLocation = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
      });
      const {latitude, longitude} = currentLocation;
      const newLocation: Location = {latitude, longitude};
      setUserLocation(newLocation);
    }
  };

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

  const deleteMutation = useMutation({
    mutationFn: delete_cart_item,
    onSuccess: (data: any) => {
      showToast(data.data.Message, 'success', 'top', 1000);
      queryClient.invalidateQueries({queryKey: ['cartItem']});
    },
    onError: (err: any) => {
      console.log(err.response.data);
    },
  });

  const addMutation = useMutation({
    mutationFn: add_quantity,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cartItem']});
    },
    onError: (err: any) => {
      console.log(err.response.data);
    },
  });

  const removeMutation = useMutation({
    mutationFn: remove_quantity,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cartItem']});
    },
  });

  const handleAdd = (id: string) => addMutation.mutate(id);
  const handleRemove = (id: string) => removeMutation.mutate(id);
  const handleDelete = async (id: string) => deleteMutation.mutate(id);

  const orderMutation = useMutation({
    mutationFn: ({
      data,
    }: {
      data: {quantity: number; latLong: string; isDefaultAddress: boolean};
    }) => place_order_By_Cart(data),
    onSuccess: () => {
      console.log('Order placed successfully!');
    },
  });

  const placeOrder = async () => {
    const data = {
      quantity: 1,
      latLong: `${String(userLocation?.latitude)},${String(
        userLocation?.longitude,
      )}`,
      isDefaultAddress: checked,
    };

    orderMutation.mutate({data});
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
              add={() => handleAdd(item.id)}
              remove={() => handleRemove(item.id)}
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
          checked={checked}
          setChecked={setChecked}
          btnTitle={'By Now'}
          onAddress={() => props.navigation.navigate(Constants.ADDRESS_SCREEN)}
          onPress={() => placeOrder()}
        />
      </View>
    </>
  );
};

export default CartScreen;
