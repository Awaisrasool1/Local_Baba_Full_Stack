import {View, Text, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './styles';
import {CategorieCard, FoodCard, Header} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {add_to_cart, get_all_product, get_categories} from '../../../services';
import {Categories} from '../../../constants/type';
import {ProductData} from './type';
import {Constants} from '../../../constants';

const SeeAllFood = (props: any) => {
  const {id, name} = props?.route?.params;
  const [categorieData, setCategorieData] = useState<Categories[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        const categorieResp = await get_categories();
        const newArry: Categories[] = categorieResp.map(
          (val: any, index: number) => ({
            ...val,
            isActive: index == 0,
          }),
        );
        setCategorieData(newArry);
        await fetchFoodItems(newArry[0].Name);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchFoodItems = useCallback(async (name: string) => {
    try {
      const productResp = await get_all_product(id, name);
      if (productResp?.products?.length > 0) {
        setProductData(productResp.products);
      }else{
        setProductData([])
      }
    } catch (err:any) {
      console.log('Error fetching products:', err.response.data);
    }
  }, []);

  const addToCart = async (id: string) => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        const res = await add_to_cart(id);
      } catch (err:any) {
        console.log(err.response.data);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.marginV5}>
        <Header
          isBack
          isBackTitle={name}
          isCart
          onBack={() => props.navigation.goBack()}
        />
        <View style={styles.marginV5} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorieData?.map((item: Categories, index: number) => (
            <CategorieCard
              key={index}
              isActive={item.isActive}
              title={item.Name}
              onPress={() => {
                const newArry: Categories[] = categorieData.map(
                  (_item: Categories) => ({
                    ..._item,
                    isActive: item.ID == _item.ID,
                  }),
                );
                setCategorieData(newArry);
                fetchFoodItems(item.Name);
              }}
            />
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        <View style={styles.marginV10} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          {productData.map((item: ProductData, index: number) => (
            <FoodCard
              key={index}
              index={index}
              image={item.image}
              name={item.title}
              rating={item.rating}
              time={item.time}
              type={item.category_name}
              addToCart={() => addToCart(item.id)}
              onPress={() => {
                props.navigation.navigate(Constants.FOOD_DETAIL, {id: item.id});
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SeeAllFood;
