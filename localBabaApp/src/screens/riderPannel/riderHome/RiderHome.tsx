import {View, Text} from 'react-native';
import React from 'react';
import {RiderChart} from '../../../components';

const RiderHome = () => {
  const data = [
    {label: '10AM', value: 50},
    {label: '11AM', value: 80},
    {label: '12PM', value: 120},
    {label: '1PM', value: 100},
    {label: '2PM', value: 150},
    {label: '3PM', value: 130},
    {label: '4PM', value: 120},
  ];
  return (
    <View>
      <RiderChart data={data} />
    </View>
  );
};

export default RiderHome;
