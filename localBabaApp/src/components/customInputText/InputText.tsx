import React, {FC} from 'react';
import {
  Image,
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styles from './styles';
import Theme from '../../theme/Theme';

interface InputTextProps extends TextInputProps {
  error?: string;
  value?: string;
  title?: string;
  secure?: boolean;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  isPassword?: boolean;
  multiline?: boolean;
  isEditable?: boolean;
  numberOfLines?: number;
  img?: any;

  viewMainStyle?: StyleProp<ViewStyle>;
  bgStyle?: StyleProp<ViewStyle>;
  viewStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  noFlex?: boolean;
  placeholderTextColor?: string;
  maxLength?: number;

  onChangeSecurity?: () => void;
  onChangeText?: (text: string) => void;
}

const InputText: FC<InputTextProps> = props => {
  return (
    <View style={props.viewMainStyle}>
      {props.title ? (
        <Text style={[styles.textSubTitle, props.textStyle]}>
          {props.title}
        </Text>
      ) : null}
      <View style={[styles.viewBgInputText, props.bgStyle]}>
        {props.img && <Image source={props.img} />}
        {props.isEditable === false ? (
          <Text
            numberOfLines={props.numberOfLines}
            style={[
              styles.textInput1,
              props.viewStyle,
              props.noFlex ? null : {flex: 1},
            ]}>
            {props.value}
          </Text>
        ) : (
          <TextInput
            style={[
              styles.textInput,
              props.viewStyle,
              props.noFlex ? null : {flex: 1},
            ]}
            value={props.value}
            keyboardType={props.keyboardType}
            secureTextEntry={props.secure}
            placeholder={props.placeholder}
            multiline={props.multiline}
            maxLength={props.maxLength}
            numberOfLines={props.numberOfLines}
            placeholderTextColor={
              props.placeholderTextColor
                ? props.placeholderTextColor
                : Theme.colors.textColor8
            }
            onChangeText={props.onChangeText}
          />
        )}

        {props.isPassword ? (
          <TouchableOpacity onPress={props.onChangeSecurity}>
            <Image
              style={styles.imageIcon}
              resizeMode={'contain'}
              source={props.secure ? Theme.icons.eye : Theme.icons.eye_off}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {props.error ? <Text style={styles.textError}>{props.error}</Text> : null}
    </View>
  );
};

export default InputText;
