import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Theme from '../../theme/Theme';
import styles from './styles';

interface Props {
  isBack?: boolean;
  isBackTitle?: string;
  onBack?: () => void;
}
const Header = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.isBack ? (
        <View style={styles.flexRow}>
          <TouchableOpacity>
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
      <Image source={Theme.icons.addToCart} />
    </View>
  );
};

export default Header;
