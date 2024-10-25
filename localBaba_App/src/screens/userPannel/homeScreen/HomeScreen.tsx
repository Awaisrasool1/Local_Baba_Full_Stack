import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Categories} from './type';
import { CategorieCard, Header, InputText, SeeAllBtn } from '../../../components';
import Theme from '../../../theme/Theme';
import { get_categories } from '../../../services';
import { isNetworkAvailable } from '../../../api';
import styles from './styles';

const HomeScreen = () => {
  const [categorieData, setCategorieData] = useState<Categories[]>([]);

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
      } catch (err) {
        console.log(err);
      }
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
        }}
      />
    );
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.marginV10}>
        <Header />
      </View>
      <View style={styles.marginV10} />
      <Text style={styles.userNmae}>
        {'Hii John,'}
        <Text style={styles.MorningText}>{' Good Morning!'}</Text>
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
        {categorieData.map(rendercategories)}
      </ScrollView>
    </ScrollView>
  );
};

export default HomeScreen;
