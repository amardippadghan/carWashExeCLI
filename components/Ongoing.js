import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const Ongoing = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    const userId = await AsyncStorage.getItem('userId');
    console.warn(userId);
    try {
      const response = await axios.get(
        `https://car-wash-backend-api.onrender.com/api/bookings/agentId/${userId}`,
      );
      setBookings(response.data);
    } catch (error) {
      console.warn('Error fetching data: ', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleViewMore = () => {
    navigation.navigate('ongoingbooking', {booking});
  };

  const filteredBookings = bookings.filter(
    booking =>
      (booking.servicesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.date.includes(searchQuery)) &&
      (booking.status === 'WorkOnIt' || booking.status === 'PickUp'),
  );

  const renderBookingCard = booking => {
    const handleViewMore = () => {
      navigation.navigate('ongoingbooking', {booking});
    };

    return (
      <View
        style={tw`flex-row justify-between items-center my-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        } ${isDarkMode ? 'border-white' : 'border-black'}`}
        key={booking._id}>
        <View style={tw`flex-1 p-4`}>
          <Text
            style={tw`font-bold text-xl mb-2 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
            {booking.clientName}
          </Text>
          <Text style={tw`${isDarkMode ? 'text-white' : 'text-black'}`}>
            Service : {booking.servicesName}
          </Text>
          <Text style={tw`${isDarkMode ? 'text-white' : 'text-black'}`}>
            {booking.pickupAddress}
          </Text>
          <View style={tw`flex-row mt-2`}>
            <Text style={tw`${isDarkMode ? 'text-white' : 'text-black'} mr-4`}>
              {booking.date}
            </Text>
            <Text style={tw`${isDarkMode ? 'text-white' : 'text-black'}`}>
              {booking.time}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={tw`bg-yellow-400 py-2 px-4 rounded-md`}
          onPress={handleViewMore}>
          <Text style={tw`text-black`}>View More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} p-4`}>
     <View style={tw`flex-row items-center space-x-2 pb-2`}>
  <View style={tw`flex-row space-x-2 flex-1 border border-gray-400 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
    <Icon style={tw`mr-2 pt-3 ml-2`} name="search" color="gray" size={20} />
    <TextInput
      placeholder="Search... by Date"
      style={tw`flex-1 ${isDarkMode ? 'text-black' : 'text-white'}`}
      value={searchQuery}
      onChangeText={setSearchQuery}
      
      keyboardType="default"
    />
  </View>
</View>

      {isLoading ? (
        <ActivityIndicator
          style={tw`mt-8`}
          size="large"
          color={isDarkMode ? '#FFFFFF' : '#000000'}
        />
      ) : (
        <ScrollView
          style={tw`flex-1`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }>
          <View style={tw`mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
            {filteredBookings.length === 0 ? (
              <View style={tw`flex-1 items-center justify-center`}>
              <FontAwesome5 name="exclamation-circle" size={35} color="#00CCBB" />

              </View>
            ) : (
              filteredBookings.map(booking => renderBookingCard(booking))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Ongoing;
