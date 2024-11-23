import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {CartFooter} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {
  get_default_address,
  get_product_byId,
  place_order_By_product,
} from '../../../services';
import Theme from '../../../theme/Theme';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useIsFocused} from '@react-navigation/native';
import {AddressData} from '../cartScreen/types';
import {useToast} from 'react-native-toasty-toast';
import {Constants} from '../../../constants';
import {checkPermission} from '../../../api/api';
import GetLocation from 'react-native-get-location';
interface Location {
  latitude: number;
  longitude: number;
}
interface ProductData {
  category: string;
  id: string;
  image: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  ingredients: any[];
}
interface ProductDetailRes {
  status: string;
  data: ProductData;
}
const FoodDetail = (props: any) => {
  const {id} = props?.route?.params;
  const isFocused = useIsFocused();
  const [checked, setChecked] = useState(false);
  const {showToast} = useToast();
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

  const {data} = useQuery({
    queryKey: ['productDetail'],
    queryFn: async () => {
      const isConnected = await isNetworkAvailable();
      if (isConnected) {
        const res: ProductDetailRes = await get_product_byId(id);
        if (res.status !== 'sucess') {
          throw new Error('Failed to fetch cart items');
        }
        return res.data;
      }
    },
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

  const orderMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {quantity: number; latLong: string; isDefaultAddress: boolean};
    }) => place_order_By_product(id, data),
    onSuccess: data => {
      if (data?.status == 'success') {
        console.log(data)
        showToast(data.message, 'success', 'top', 1000);
        props.navigation.navigate(Constants.ORDER_SUCCESS, {id: data.orderID});
      }
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

    orderMutation.mutate({id, data});
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{uri: data?.image}} style={styles.productImge} />
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => props.navigation.goBack()}>
          <Image source={Theme.icons.leftArrowBg} />
        </TouchableOpacity>
        <View
          style={[
            styles.marginV10,
            {paddingHorizontal: Theme.responsiveSize.size10},
          ]}>
          <Text style={styles.nameText}>{data?.title}</Text>
          <View style={styles.marginV5} />
          <View style={styles.flexRow}>
            <Image source={Theme.icons.vector} />
            <Text style={styles.categoryText}>{data?.category}</Text>
          </View>
          <Text style={styles.descriptionText}>{data?.description}</Text>
          <Text style={styles.ingridents}>{'Ingridents'}</Text>
          <View style={styles.flexRow}>
            {data?.ingredients?.map((val: any) => (
              <View>
                <Text style={styles.ingridentssubText}>{val?.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.marginV50} />
      </ScrollView>
      <View style={styles.footer}>
        <CartFooter
          discountedPrice={data?.discountedPrice}
          price={data?.originalPrice}
          address={defaultAddress?.fullAddress}
          type={'details'}
          checked={checked}
          setChecked={setChecked}
          btnTitle={'By Now'}
          onAddress={() => props.navigation.navigate(Constants.ADDRESS_SCREEN)}
          onPress={() => placeOrder()}
        />
      </View>
    </SafeAreaView>
  );
};

export default FoodDetail;
