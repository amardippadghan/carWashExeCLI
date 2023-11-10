import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  Button,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const ProfilePage = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    address: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        if (userId) {
          setLoading(true);

          const response = await axios.get(
            `https://car-wash-backend-api.onrender.com/api/agents/${userId}`,
          );

          setProfileData(response.data);
        } else {
          console.log('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    // You can pass the selected image URI to the 'editProfile' screen if needed
    navigation.navigate('editProfile', {
      profileData: profileData,
      selectedImage: selectedImage,
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    navigation.navigate('Login');
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  

  // Data for the agent information table
  const agentInfoData = [
    {label: 'Full Name', value: profileData.fullName},
    {label: 'Email', value: profileData.email},
    {label: 'Contact', value: profileData.contactNumber},
    {label: 'Date of Birth', value: profileData.dateOfBirth},
    {label: 'Address', value: profileData.address},
  ];

  const renderAgentInfoItem = ({item}) => (
    <View style={tw`flex-row justify-between items-center mb-4`}>
      <Text style={tw`text-lg font-bold w-40 text-black`}>{item.label}</Text>
      <Text style={tw`text-lg w-60 text-black`}>{item.value}</Text>
    </View>
  );

  return (
    <View
      style={tw`flex-1 items-center ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
      } pt-5`}>
      <View style={tw`flex-row justify-between items-center w-full px-8 mb-5`}>
        <Text style={tw`text-2xl font-bold ${textColor}`}>Profile</Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={tw`bg-yellow-300 py-1 px-3 rounded-lg`}>
          <Text style={tw`text-lg text-black`}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={isDarkMode ? 'white' : 'gray'}
          style={{marginTop: 20, marginBottom: 20}}
        />
      ) : (
        <>
          <TouchableOpacity onPress={openImagePicker}>
            {selectedImage ? (
              <Image
                source={{uri: selectedImage}}
                style={tw`w-52 h-52 rounded-full`}
              />
            ) : (
              <Image
                source={{uri: 'https://picsum.photos/200'}}
                style={tw`w-52 h-52 rounded-full`}
              />
            )}
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold mt-3 ${textColor}`}>
            {profileData.fullName}
          </Text>
          <View
            style={tw`w-5/6 bg-white p-5 w-96 rounded-lg mt-5 ml-5 mr-5 shadow-2xl`}>
            <FlatList
              data={agentInfoData}
              keyExtractor={item => item.label}
              renderItem={renderAgentInfoItem}
            />
          </View>
          <TouchableOpacity
            onPress={handleEdit}
            style={tw`bg-blue-300 py-2 px-6 rounded-lg mt-5`}>
            <Text style={tw`text-lg text-black`}>Edit</Text>
          </TouchableOpacity>
        </>
      )}

      
    </View>
  );
};

export default ProfilePage;
