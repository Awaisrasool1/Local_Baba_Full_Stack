import {View, Text} from 'react-native';
import React from 'react';
import {RiderChart} from '../../../components';

const RiderHome = () => {
  const chartData = [
    {time: '10AM', value: 2020},
    {time: '11AM', value: 200},
    {time: '12PM', value: 1000},
    {time: '1PM', value: 200},
    {time: '2PM', value: 200},
    {time: '3PM', value: 100},
    {time: '4PM', value: 500},
  ];
  return (
    <View>
      <RiderChart data={chartData} totalRevenue={120}  />
    </View>
  );
};

export default RiderHome;
