import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {
  CustomButton,
  Header,
  InputText,
  ProfileCard,
} from '../../../../components';
import Theme from '../../../../theme/Theme';

const ProfileScreen = (props: any) => {
  const {data} = props?.route?.params;
  const [name, setName] = useState(data?.name);
  const [phoneNo, setPhoneNO] = useState(data?.phone);

  const [flag, setFlag] = useState(true);
  //error state
  const [nameError, setNameError] = useState('');

  const menuItems = [
    {
      id: 1,
      title: 'Full Name',
      subTitle: data?.name,
      icon: Theme.icons.profile,
      section: 1,
    },
    {
      id: 2,
      title: 'Email',
      subTitle: data?.email,
      icon: Theme.icons.email,
      section: 1,
    },
    {
      id: 3,
      title: 'Phone Number',
      subTitle: data?.phone,
      icon: Theme.icons.PhoneNo,
      section: 2,
    },
  ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.paddingH10}>
        <Header
          isBack
          isBackTitle={flag ? 'Personal Details' : 'Edit Profile'}
          onlyBack
          onBack={() => props.navigation.goBack()}
        />
      </View>
      {flag ? (
        <>
          <View style={styles.header}>
            <Image
              source={{
                uri: data?.image
                  ? data?.image
                  : 'https://via.placeholder.com/100',
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.name}>{data?.name}</Text>
              <Text style={styles.email}>{data?.email}</Text>
            </View>
            <TouchableOpacity onPress={() => setFlag(false)}>
              <Text style={styles.editText}>{'Edit'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            {menuItems.map((item: any, index: number) => (
              <ProfileCard
                key={index}
                subTitle={item.subTitle}
                title={item.title}
                icon={item.icon}
                isDisable
                onPress={() => {}}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.padingH10}>
          <View style={styles.itemCener}>
            <View>
              <Image
                source={{
                  uri: data?.image
                    ? data?.image
                    : 'https://via.placeholder.com/100',
                }}
                style={styles.editImage}
              />
              <TouchableOpacity style={styles.editIcon}>
                <Image source={Theme.icons.editIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.marginV10} />
          <InputText
            value={name}
            title="Full Name"
            error={nameError}
            onChangeText={setName}
            placeholder="Enter your Name"
          />
          <View style={styles.marginV10} />
          <InputText
            value={data?.email}
            title="Email"
            placeholder="Enter your Email"
            isEditable={flag}
          />
          <View style={styles.marginV10} />
          <InputText
            value={phoneNo}
            title="Phone Number"
            error={nameError}
            onChangeText={setPhoneNO}
            placeholder="Enter your Phone Number"
          />
          <View style={styles.marginV10} />
          <CustomButton title="Save" onClick={() => {}} />
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
