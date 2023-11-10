import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const ProfilePage = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const [Loading , setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    address: '',
  });
//  const clearAllAsyncStorage = async () => {
//    try {
//      await AsyncStorage.clear();
//      console.log('AsyncStorage has been cleared successfully.');
//    } catch (error) {
//      console.error('Error clearing AsyncStorage:', error);
//    }
//  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the user ID from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');

        if (userId) {
          // Make an API request using the retrieved user ID
          setLoading(true)
          const response = await axios.get(
            `https://car-wash-backend-api.onrender.com/api/agents/${userId}`,
          );

          setProfileData(response.data);
        } else {
          console.log('User ID not found in AsyncStorage');
          // Handle the case when the user ID is not found in AsyncStorage
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      finally{
        setLoading(false)
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    navigation.navigate('editProfile', {profileData: profileData});
  };
  const handleLogout = async () => {
    // Clear the user ID from AsyncStorage
    await AsyncStorage.removeItem('userId');

    // Navigate to the login screen
    navigation.navigate('Login');
  };

  // Data for the agent information table
  const agentInfoData = [
    {label: 'Full Name', value: profileData.fullName},
    {label: 'Email', value: profileData.email},
    {label: 'Contact', value: profileData.contactNumber},
    {label: 'Date of Birth', value: profileData.dateOfBirth},
    {label: 'Address', value: profileData.address},
  ];

  // Function to render each row in the table
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
      {Loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? 'white' : 'gray' }  style={{ marginTop: 20, marginBottom: 20 }} />
      ) : (
        <>
          <Image
            source={{uri: 'https://picsum.photos/200'}}
            style={tw`w-52 h-52 rounded-full`}
          />
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
