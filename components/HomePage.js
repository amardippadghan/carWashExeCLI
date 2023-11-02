import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const HomePage = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleprofilepage = () => {
    navigation.navigate('ProfilePage');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    const userId = await AsyncStorage.getItem('userId');
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
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Check if the current route is the home page
        if (navigation.isFocused()) {
          // If it's the home page, prevent going back
          return true;
        }
        // If it's not the home page, allow going back
        return false;
      },
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [navigation]);

  const renderBookingCard = booking => {
    const handleViewMore = () => {
      navigation.navigate('BookingDetailsScreen', {bookingId: booking._id});
    };

    return (
      <View
        style={tw`rounded-lg p-4 my-4 shadow-md ${
          isDarkMode
            ? 'bg-gray-800 border border-gray-600'
            : 'bg-white border border-gray-300'
        }`}
        key={booking._id}>
        <View style={tw`flex-1 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Text
            style={tw`font-bold text-xl mb-2 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
            {booking.clientName}
          </Text>
          <Text
            style={tw`text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Service: {booking.servicesName}
          </Text>
          <Text
            style={tw`text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>
            PickUp Address: {booking.pickupAddress}
          </Text>
          <View style={tw`flex-row mt-2`}>
            <Text
              style={tw`text-base ${
                isDarkMode ? 'text-white' : 'text-black'
              } mr-4`}>
              {booking.date}
            </Text>
            <Text
              style={tw`text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {booking.time}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={tw`bg-yellow-400 py-2 px-4 rounded-md items-center`}
          onPress={handleViewMore}>
          <Text style={tw`text-black`}>View More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const acceptedBookings = bookings.filter(
    booking => booking.status === 'Accepted',
  );

  const filteredBookings = acceptedBookings.filter(
    booking =>
      booking.servicesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.date.includes(searchQuery),
  );

  return (
    <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4`}>
      <View style={tw`flex-row pb-3 items-center justify-between`}>
        <Image
          source={{uri: 'https://icons8.com/icon/J0im2VMpg6mr/convertible'}}
          style={tw`h-12 w-12 bg-gray-300 p-4 rounded-full`}
        />
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={handleprofilepage}>
            <FontAwesome5 name="user" size={35} color="#00CCBB" />
          </TouchableOpacity>
        </View>
      </View>
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
          size="large"
          color={isDarkMode ? '#FFFFFF' : '#000000'}
          style={tw`mt-8`}
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
                <FontAwesome5
                  name="exclamation-circle"
                  size={35}
                  color="#00CCBB"
                />
              </View>
            ) : (
              filteredBookings.map(booking => (
                <View key={booking._id} style={tw`mb-4`}>
                  {renderBookingCard(booking)}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default HomePage;
