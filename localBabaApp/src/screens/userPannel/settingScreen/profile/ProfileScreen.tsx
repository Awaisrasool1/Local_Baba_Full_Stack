import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {CustomButton, Header, InputText} from '../../../../components';

const ProfileScreen = (props: any) => {
  const [name, setName] = useState('');
  //error state
  const [nameError, setNameError] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.paddingH10}>
        <Header
          isBack
          isBackTitle="Profile"
          onlyBack
          onBack={() => props.navigation.goBack()}
        />
      </View>
      <Image
        source={{uri: 'https://via.placeholder.com/100'}}
        style={styles.profileImage}
      />
      <InputText
        value={name}
        title="Password"
        error={nameError}
        onChangeText={setName}
        placeholder="Enter your Name"
      />
      <CustomButton title="" onClick={() => {}} />
    </View>
  );
};

export default ProfileScreen;
