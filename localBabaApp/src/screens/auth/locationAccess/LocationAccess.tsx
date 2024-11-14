import {View, Text, Image} from 'react-native';
import React from 'react';
import Theme from '../../../theme/Theme';
import {styles} from './styles';
import {CustomButton} from '../../../components';
import {Constants} from '../../../constants';

const LocationAccess = (props: any) => {
  return (
    <View style={styles.container}>
      <Image source={Theme.icons.mapLogo} />
      <CustomButton
        title="Access LOCATION"
        img={Theme.icons.mapIcon}
        onClick={() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: Constants.HOME_SCREEN}],
          });
        }}
        bgStyle={styles.locationBtn}
      />
      <Text style={styles.text}>{'Local Baba will access your location'}</Text>
    </View>
  );
};

export default LocationAccess;
