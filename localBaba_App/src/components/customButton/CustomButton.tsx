import React, {FC, ReactNode} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styles from './styles';

interface CustomButtonProps {
  svg?: ReactNode;
  title: string;
  img?: ImageSourcePropType;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadColor?: string;
  onClick: () => void;
  bgStyle?: StyleProp<ViewStyle>;
  styleSvg?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: FC<CustomButtonProps> = props => {
  const renderLoader = () => {
    return (
      <View style={[styles.bgStyle, props.bgStyle]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="small" color={props.loadColor} />
        </View>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {props.svg ? (
          <View style={[styles.viewSvg, props.styleSvg]} children={props.svg} />
        ) : null}
        <Text style={[styles.textStyle, props.textStyle]}>{props.title}</Text>
        {props.img && <Image source={props.img} style={styles.image} />}
      </View>
    );
  };

  if (props.isLoading) {
    return renderLoader();
  } else if (props.isDisabled) {
    return (
      <View style={[styles.bgStyle, props.bgStyle]}>{renderButton()}</View>
    );
  } else {
    return (
      <TouchableOpacity
        style={[styles.bgStyle, props.bgStyle]}
        onPress={props.onClick}>
        {renderButton()}
      </TouchableOpacity>
    );
  }
};

export default CustomButton;
