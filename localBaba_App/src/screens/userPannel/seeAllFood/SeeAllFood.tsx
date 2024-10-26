import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {CategorieCard, FoodCard, Header} from '../../../components';
import {isNetworkAvailable} from '../../../api';
import {get_all_product, get_categories} from '../../../services';
import {Categories} from '../../../constants/type';
import {ProductData} from './type';

const SeeAllFood = (props: any) => {
  const {id, name} = props?.route?.params;
  const [categorieData, setCategorieData] = useState<Categories[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        const categorieResp = await get_categories();
        const newArry = categorieResp.map((val: any, index: number) => ({
          ...val,
          isActive: index == 0,
        }));
        setCategorieData(newArry);
        const productResp = await get_all_product(id);
        console.log(productResp.data)
        setProductData(productResp.data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.marginV10}>
        <Header
          isBack
          isBackTitle={name}
          onBack={() => props.navigation.goBack()}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categorieData?.map((item: Categories, index: number) => (
          <CategorieCard
            key={index}
            isActive={item.isActive}
            title={item.Name}
            onPress={() => {
              const newArry = categorieData.map((_item: Categories) => ({
                ..._item,
                isActive: item.ID == _item.ID,
              }));
              setCategorieData(newArry);
            }}
          />
        ))}
      </ScrollView>
      <View style={styles.marginV10} />
      <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}> 
      {productData.map((item: ProductData, index: number) => (
        <FoodCard
          key={index}
          index={index}
          image={item.image}
          name={item.name}
          rating={item.rating}
          time={item.time}
          type={item.category_name}
        />
      ))}
      </View>
    </ScrollView>
  );
};

export default SeeAllFood;
