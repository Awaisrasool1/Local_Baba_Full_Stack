import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import {
  CustomButton,
  DropPicker,
  Header,
  InputText,
  ProfileCard,
} from '../../../components';
import Theme from '../../../theme/Theme';
import {checkPermission} from '../../../api/api';

const RiderProInfo = ({route, navigation}: any) => {
  const {data} = route?.params;

  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [imageData, setImageData] = useState<string | undefined>();
  const [isEditing, setEditing] = useState(false);
  const [nameError, setNameError] = useState('');

  const menuItems = [
    {id: 1, title: 'Full Name', subTitle: '', icon: Theme.icons.profile},
    {id: 2, title: 'Email', subTitle: '', icon: Theme.icons.email},
    {
      id: 3,
      title: 'Phone Number',
      subTitle: '',
      icon: Theme.icons.PhoneNo,
    },
  ];

  const handleImageSelection = async (source: 'camera' | 'gallery') => {
    const permission = await checkPermission(source);
    if (!permission.result) return;

    const options: {
      width: number;
      height: number;
      cropping: boolean;
      mediaType: 'photo';
    } = {width: 300, height: 400, cropping: true, mediaType: 'photo'};

    try {
      const image =
        source === 'camera'
          ? await ImagePicker.openCamera(options)
          : await ImagePicker.openPicker(options);

      setImageData(image.path);
      setOverlayVisible(false);
      await uploadImage(image);
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };

  const uploadImage = async (image: any) => {
    try {
      const filename = image.path.split('/').pop();
      const formData = new FormData();
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: filename,
      });
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setImageData(data.image);
  //   }, [data.image]),
  // );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.paddingH10}>
        <Header
          isBack
          isBackTitle={isEditing ? 'Edit Profile' : 'Personal Details'}
          onlyBack
          onBack={navigation.goBack}
        />
      </View>

      {isEditing ? (
        <View style={styles.paddingH10}>
          <View style={styles.itemCener}>
            <View>
              <Image
                source={{
                  uri: imageData || 'https://via.placeholder.com/100',
                }}
                style={styles.editImage}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => setOverlayVisible(true)}>
                <Image source={Theme.icons.editIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <InputText
            value={name}
            title="Full Name"
            error={nameError}
            onChangeText={setName}
            placeholder="Enter your Name"
          />
          <InputText
            value={''}
            title="Email"
            placeholder="Enter your Email"
            isEditable={false}
          />
          <InputText
            value={''}
            title="Phone Number"
            onChangeText={setPhoneNo}
            placeholder="Enter your Phone Number"
          />

          <CustomButton title="Save" onClick={() => setEditing(false)} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Image
              source={{
                uri: imageData || 'https://via.placeholder.com/100',
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.name}>{}</Text>
              <Text style={styles.email}>{}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            {menuItems.map(item => (
              <ProfileCard
                key={item.id}
                subTitle={item.subTitle}
                title={item.title}
                icon={item.icon}
                isDisable
                onPress={() => {}}
              />
            ))}
          </View>
        </>
      )}

      <DropPicker
        title="Profile Picture Selection:"
        isLoading={isOverlayVisible}
        Camera={() => handleImageSelection('camera')}
        Image={() => handleImageSelection('gallery')}
        Close={() => setOverlayVisible(false)}
      />
    </ScrollView>
  );
};

export default RiderProInfo;
