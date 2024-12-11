import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Overlay} from 'react-native-elements';
import Theme from '../../theme/Theme';
import {CustomButton} from '../customButton';
import {useNavigation} from '@react-navigation/native';
import {Constants} from '../../constants';

interface props {
  isVisible: boolean;
  setVisible: (i: boolean) => void;
}
const RiderPopup = (props: props) => {
  const nav: any = useNavigation();
  return (
    <Overlay isVisible={props.isVisible}>
      <View style={styles.container}>
        <View style={styles.margin} />
        <Image source={Theme.icons.pop_Up_Icon} />
        <Text style={styles.text}>{'Order Completed'}</Text>
        <CustomButton
          bgStyle={{width: '100%'}}
          title="Go to Home"
          onClick={() => {
            props.setVisible(false);
            nav.reset({
              index: 0,
              routes: [{name: Constants.RIDER_BOTTOM_TAB}],
            });
          }}
        />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Theme.responsiveSize.size200,
    height: Theme.responsiveSize.size145,
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  text: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Theme.responsiveSize.size15,
    marginBottom: Theme.responsiveSize.size10,
  },
  margin: {
    marginTop: Theme.responsiveSize.size10,
  },
});

export default RiderPopup;
