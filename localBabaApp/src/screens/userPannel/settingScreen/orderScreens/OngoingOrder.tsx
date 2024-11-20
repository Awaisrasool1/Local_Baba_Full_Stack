import {View, Text} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {get_user_onGoing_order} from '../../../../services';

const OngoingOrder = () => {
  const {data, error, isLoading} = useQuery({
    queryKey: ['onGoing'],
    queryFn: get_user_onGoing_order,
  });
  
  return (
    <View>
      <Text>OngoingOrder</Text>
    </View>
  );
};

export default OngoingOrder;
