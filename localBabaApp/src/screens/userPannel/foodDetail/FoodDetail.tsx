import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import styles from './styles';
import {CartFooter, Header} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {get_product_byId} from '../../../services';
import Theme from '../../../theme/Theme';
import {useQuery} from '@tanstack/react-query';

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

  const {data} = useQuery({
    queryKey: ['productDetail'],
    queryFn: async () => {
      const isConnected = await isNetworkAvailable();
      if (isConnected) {
        const res: ProductDetailRes = await get_product_byId(id);
        console.log(res.data);
        if (res.status !== 'sucess') {
          throw new Error('Failed to fetch cart items');
        }
        return res.data;
      }
    },
  });

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
          btnTitle={'By Now'}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default FoodDetail;
