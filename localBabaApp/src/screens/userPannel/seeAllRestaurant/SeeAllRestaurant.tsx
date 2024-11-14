import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {isNetworkAvailable} from '../../../api';
import {get_categories} from '../../../services';
import {Categories, Restaurants} from '../../../constants/type';
import styles from './styles';
import {CategorieCard, Header, RestaurantCard} from '../../../components';
import {Constants} from '../../../constants';

const SeeAllRestaurant = (props: any) => {
  const {data, flag} = props?.route?.params;
  const [categorieData, setCategorieData] = useState<Categories[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurants[]>([]);
  //filter states
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurants[]>(
    [],
  );
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        const categorieResp = await get_categories();
        const newArry = categorieResp?.map((val: any, index: number) => ({
          ...val,
          isActive: index == 0,
        }));
        setCategorieData(newArry);
        setAllRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filter = (name: string) => {
    if (name.toUpperCase() === 'ALL') {
      setFilteredRestaurants(allRestaurants);
    } else {
      const filtered = allRestaurants.filter(
        (restaurant: Restaurants) =>
          restaurant.serviesType?.toLowerCase() === name?.toLowerCase(),
      );
      setFilteredRestaurants(filtered);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.marginV10}>
        <Header
          isBack
          isBackTitle={flag}
          isCart
          onBack={() => props.navigation.goBack()}
        />
      </View>
      <View style={styles.marginV5}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorieData?.map((item: Categories, index: number) => (
            <CategorieCard
              key={index}
              isActive={item.isActive}
              title={item.Name}
              onPress={() => {
                const newArry = categorieData?.map((_item: Categories) => ({
                  ..._item,
                  isActive: item.ID == _item.ID,
                }));
                setCategorieData(newArry);
                filter(item.Name);
              }}
            />
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants?.map((item: Restaurants, index: number) => (
            <RestaurantCard
              key={index}
              image={item.image}
              name={item.name}
              serviesType={item.serviesType}
              rating={item.rating}
              onPress={() => {
                props.navigation.navigate(Constants.SEE_ALL_FOOD, {
                  id: item.id,
                  name: item.name,
                });
              }}
              bgStyle={{width: '100%'}}
            />
          ))
        ) : (
          <Text style={styles.noDataText}>{'No Restaurants Found !'}</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SeeAllRestaurant;
