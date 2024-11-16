import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CategorieCard,
  Header,
  InputText,
  RestaurantCard,
  SeeAllBtn,
} from '../../../components';
import Theme from '../../../theme/Theme';
import {
  get_all_restaurants,
  get_categories,
  get_nearby_restaurants,
} from '../../../services';
import {isNetworkAvailable} from '../../../api';
import styles from './styles';
import {Constants} from '../../../constants';
import {Categories, Restaurants} from '../../../constants/type';
import {getName} from '../../../api/api';

const HomeScreen = (props: any) => {
  const [categorieData, setCategorieData] = useState<Categories[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurants[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurants[]>([]);
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
        const newArry = categorieResp.map((val: any, index: number) => ({
          ...val,
          isActive: index == 0,
        }));
        setCategorieData(newArry);
        const allRestaurant = await get_all_restaurants();
        setAllRestaurants(allRestaurant);
        setFilteredRestaurants(allRestaurant);
        // const nearbyRestaurant = await get_nearby_restaurants();
        // setNearbyRestaurants(nearbyRestaurant);
      } catch (err:any) {
        console.log(err.response.data);
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

  const rendercategories = (item: Categories, index: number) => {
    return (
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
          filter(item.Name);
        }}
      />
    );
  };
  const renderRestaurants = (item: Restaurants, index: number) => {
    return (
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
      />
    );
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.marginV10}>
        <Header isCart />
      </View>
      <View style={styles.marginV10} />
      <Text style={styles.userNmae}>
        {getName()?.toUpperCase()}
        <Text style={styles.MorningText}>{', Good Morning!'}</Text>
      </Text>
      <View style={styles.marginV5} />
      <InputText
        img={Theme.icons.Search}
        placeholder="Search dishes, restaurants"
        viewStyle={{paddingLeft: Theme.responsiveSize.size10}}
      />
      <View style={styles.marginV5} />
      <SeeAllBtn title="Categories" onPress={() => {}} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categorieData?.map(rendercategories)}
      </ScrollView>
      <View style={styles.marginV5} />
      <SeeAllBtn
        isSeeAll
        title="All Restaurants"
        onPress={() => {
          props.navigation.navigate(Constants.SEE_ALL_RESTAURANT, {
            data: allRestaurants,
            flag: 'All Restaurants',
          });
        }}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filteredRestaurants?.length > 0 ? (
          filteredRestaurants?.map(renderRestaurants)
        ) : (
          <Text style={styles.noDataText}>{'No Restaurants Found !'}</Text>
        )}
      </ScrollView>
    </ScrollView>
  );
};

export default HomeScreen;
