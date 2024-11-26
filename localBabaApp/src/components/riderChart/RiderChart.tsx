import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  width: screenWidth * 0.9,
  height: 200,
  barWidth: 40,
  spacing: 10,
  backgroundColor: '#f4f4f4',
  axisColor: '#333',
  barColor: '#3498db',
};
const RiderChart = ({data}: any) => {
  const maxValue = Math.max(...data.map((item: any) => item.value));
  return (
    <View style={styles.container}>
      {data.map((item: any, index: any) => (
        <View key={index} style={styles.bar}>
          <View
            style={[
              styles.barInner,
              {
                height: (item.value / maxValue) * (chartConfig.height - 40),
                backgroundColor: chartConfig.barColor,
              },
            ]}
          />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: chartConfig.width,
    height: chartConfig.height,
    backgroundColor: chartConfig.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  bar: {
    width: chartConfig.barWidth,
    alignItems: 'center',
  },
  barInner: {
    width: '100%',
    borderRadius: 4,
  },
  label: {
    color: chartConfig.axisColor,
    marginTop: 8,
  },
});

export default RiderChart;
