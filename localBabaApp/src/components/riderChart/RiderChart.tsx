import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Svg, {Polyline, Circle, Line} from 'react-native-svg';

const {width} = Dimensions.get('window');
const chartHeight = 200;
const chartWidth = width - 40;

type ChartPoint = {
  time: string;
  value: number;
};

type ChartProps = {
  data: ChartPoint[];
  totalRevenue: number;
  highlightIndex?: number; // Optional: index of the point to highlight
};

const normalizeValue = (value: number, minValue: number, maxValue: number) =>
  ((value - minValue) / (maxValue - minValue)) * chartHeight;

const RiderChart: React.FC<ChartProps> = ({
  data,
  totalRevenue,
  highlightIndex,
}) => {
  const maxValue = Math.max(...data.map(point => point.value));
  const minValue = Math.min(...data.map(point => point.value));

  const graphPoints = data
    .map(
      (point, index) =>
        `${(index / (data.length - 1)) * chartWidth},${
          chartHeight - normalizeValue(point.value, minValue, maxValue)
        }`,
    )
    .join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Total Revenue</Text>
        <Text style={styles.subTitle}>Daily</Text>
      </View>
      <Text style={styles.totalRevenue}>₹ {totalRevenue}</Text>
      <Svg width={chartWidth} height={chartHeight}>
        <Polyline
          points={graphPoints}
          fill="none"
          stroke="#4A90E2"
          strokeWidth={3}
        />
        {data.map((point, index) => (
          <Circle
            key={index}
            cx={(index / (data.length - 1)) * chartWidth}
            cy={chartHeight - normalizeValue(point.value, minValue, maxValue)}
            r={5}
            fill="#4A90E2"
            stroke="white"
            strokeWidth={2}
          />
        ))}
        {highlightIndex !== undefined && (
          <Line
            x1={(highlightIndex / (data.length - 1)) * chartWidth}
            y1={
              chartHeight -
              normalizeValue(data[highlightIndex].value, minValue, maxValue)
            }
            x2={(highlightIndex / (data.length - 1)) * chartWidth}
            y2={chartHeight}
            stroke="#888"
            strokeDasharray="4,2"
          />
        )}
      </Svg>
      <View style={styles.labels}>
        {data.map((point, index) => (
          <Text key={index} style={styles.labelText}>
            {point.time}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 14,
    color: '#888',
  },
  totalRevenue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 12,
    color: '#888',
  },
});

export default RiderChart;
