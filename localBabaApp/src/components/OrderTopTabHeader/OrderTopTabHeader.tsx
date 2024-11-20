import {View, Text} from 'react-native';
import React from 'react';
import {Header} from '../header';
import {useNavigation} from '@react-navigation/native';

const OrderTopTabHeader = () => {
  const nav :any= useNavigation();
  
  return (
    <View>
      <Header
        isBackTitle="sd"
        onBack={() => nav.goBack()}
        isBack
        onlyBack
      />
    </View>
  );
};

export default OrderTopTabHeader;
