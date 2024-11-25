import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import Theme from '../../theme/Theme';

interface Props {
  title: string;
  subTitle?: string;
  icon: any;
  isDisable?: boolean;
  onPress: () => void;
}

const ProfileCard = (props: Props) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={props.onPress}
      disabled={props.isDisable}>
      <View style={styles.menuItemLeft}>
        <Image source={props.icon} />
        <View>
          <Text style={styles.menuItemText}>{props.title}</Text>
          {props.subTitle && (
            <Text style={styles.menuItemText}>{props.subTitle}</Text>
          )}
        </View>
      </View>
      <Image source={Theme.icons.rightArrow} />
    </TouchableOpacity>
  );
};

export default ProfileCard;
