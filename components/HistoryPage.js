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
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import the FontAwesome5 icon
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const HistoryPage = () => {
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

 const filteredBookings = bookings
   .filter(booking => {
     return (
       booking.status === 'Delivered' &&
       (booking.servicesName
         ?.toLowerCase()
         .includes(searchQuery.toLowerCase()) ||
         booking.date.includes(searchQuery))
     );
   })
   .sort((a, b) => {
     const datePartsA = a.date.split('-');
     const datePartsB = b.date.split('-');

     const timePartsA = a.time.split(' ');
     const timePartsB = b.time.split(' ');

     const dateA = new Date(
       parseInt(datePartsA[2]),
       parseInt(datePartsA[1]) - 1,
       parseInt(datePartsA[0]),
       timePartsA[1].toLowerCase() === 'am'
         ? parseInt(timePartsA[0].split(':')[0])
         : parseInt(timePartsA[0].split(':')[0]) + 12,
       parseInt(timePartsA[0].split(':')[1]),
     ).getTime();

     const dateB = new Date(
       parseInt(datePartsB[2]),
       parseInt(datePartsB[1]) - 1,
       parseInt(datePartsB[0]),
       timePartsB[1].toLowerCase() === 'am'
         ? parseInt(timePartsB[0].split(':')[0])
         : parseInt(timePartsB[0].split(':')[0]) + 12,
       parseInt(timePartsB[0].split(':')[1]),
     ).getTime();

     return dateB - dateA;
   });


  const renderBookingCard = booking => {
      const handleViewMore = () => {
        navigation.navigate('ViewMore_history', {customer: booking});
      };
    return (
      <TouchableOpacity
        style={tw`flex-row justify-between items-center my-4 rounded-lg p-4 shadow-md bg-${
          isDarkMode ? 'gray-700' : 'white'
        } `}
        key={booking._id}
        onPress={handleViewMore}>
        <View style={tw`flex-1`}>
          <Text
            style={tw`font-bold text-xl mb-2 text-${
              isDarkMode ? 'white' : 'black'
            }`}>
            {booking.clientName}
          </Text>
          <Text style={tw`text-${isDarkMode ? 'white' : 'black'}`}>
            Service: {booking.servicesName}
          </Text>
          <Text style={tw`text-${isDarkMode ? 'white' : 'black'}`}>
            {booking.pickupAddress}
          </Text>
          <View style={tw`flex-row mt-2`}>
            <Text style={tw`text-${isDarkMode ? 'white' : 'black'} mr-4`}>
              {booking.date}
            </Text>
            <Text style={tw`text-${isDarkMode ? 'white' : 'black'}`}>
              {booking.time}
            </Text>
          </View>
        </View>
        <View
          style={tw`bg-green-500 px-4 py-2 rounded-md absolute top-2 right-2`}>
          <Text style={tw`text-white text-sm`}>{booking.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 p-4 bg-${isDarkMode ? 'gray-800' : 'gray-200'}`}>
      <View style={tw`flex-row items-center space-x-2 pb-2`}>
        <View
          style={tw`flex-row space-x-2 flex-1 border border-gray-400 rounded-md ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
          <Icon
            style={tw`mr-2 pt-3 ml-2`}
            name="search"
            color="gray"
            size={20}
          />
          <TextInput
            placeholder="Search... by Date"
            style={tw`flex-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={isDarkMode ? 'lightgray' : 'darkgray'}
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
          <View style={tw`mb-4`}>
            {filteredBookings.length === 0 ? (
              <View style={tw`flex-1 items-center justify-center`}>
                <Text
                  style={tw`text-xl text-${isDarkMode ? 'white' : 'black'}`}>
                  No delivered tasks available
                </Text>
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

export default HistoryPage;
