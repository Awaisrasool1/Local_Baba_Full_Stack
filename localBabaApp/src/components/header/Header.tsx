import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Theme from '../../theme/Theme';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {Constants} from '../../constants';

interface Props {
  isBack?: boolean;
  isCart?: boolean;
  isEdit?: boolean;
  isBackTitle?: string;
  onBack?: () => void;
  onEdit?: () => void;
}
const Header = (props: Props) => {
  const nav: any = useNavigation();
  return (
    <View style={styles.container}>
      {props.isBack ? (
        <View style={styles.flexRow}>
          <TouchableOpacity onPress={props.onBack}>
            <Image source={Theme.icons.leftArrowBg} />
          </TouchableOpacity>
          <Text style={styles.isBackText}>{props.isBackTitle}</Text>
        </View>
      ) : (
        <Image source={Theme.icons.Menu} />
      )}
      {!props.isBack && (
        <View>
          <Text style={styles.topHeading}>{'Deliver to'}</Text>
          <Text style={styles.topSubHeading}>{'Delhi,India'}</Text>
        </View>
      )}
      {props.isCart && (
        <TouchableOpacity onPress={() => nav.navigate(Constants.CART_SCREEN)}>
          <Image source={Theme.icons.addToCart} />
        </TouchableOpacity>
      )}
      {!props.isEdit && !props.isCart ? (
        <TouchableOpacity onPress={props.onEdit}>
          <Text style={styles.editText}>{'Edit'}</Text>
        </TouchableOpacity>
      ) : (
        props.isEdit &&
        !props.isCart && (
          <TouchableOpacity onPress={props.onEdit}>
            <Text style={[styles.editText, {color: Theme.colors.textColor21}]}>
              {'Done'}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

export default Header;
