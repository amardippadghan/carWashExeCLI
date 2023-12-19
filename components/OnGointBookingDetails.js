import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import tw from 'twrnc';

export default function OnGoingBookingDetails({route}) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {booking} = route.params;
  const navigation = useNavigation();

  const [bookingDetails, setBookingDetails] = useState(booking);
  

  const handleCallClient = () => {
    const phoneNumber = bookingDetails.clientContact;
    Linking.openURL(`tel:+91${phoneNumber}`);
  };
const patchBookingStatus = async status => {
  try {
    if (status === 'PickUp') {
      const storedLocationId = await AsyncStorage.getItem('locationId');
      if (storedLocationId) {
        Alert.alert(
          'Location ID already exists',
          'Please clear the location ID before picking up again',
        );
        return;
      } else {
        // Assuming bookingDetails.locationId is the new location ID
        await AsyncStorage.setItem('locationId', bookingDetails.locationId);
      }
    } else if (status === 'Delivered') {
      const storedLocationId = await AsyncStorage.getItem('locationId');
      if (storedLocationId) {
        await AsyncStorage.removeItem('locationId');
      }
    }

    const response = await axios.patch(
      `https://car-wash-backend-api.onrender.com/api/bookings/${bookingDetails._id}`,
      {status},
    );

    setBookingDetails(response.data);

    Alert.alert(
      status === 'PickUp'
        ? 'Great, Status updated to Car is Pickup Now'
        : 'Great Job, Task completed',
    );
  } catch (error) {
    console.error('Error updating booking status:', error);
  }
};





  return (
    <View
      style={[
        tw`flex-1 p-4 pt-10 `,
        isDarkMode ? tw`bg-gray-800` : tw`bg-gray-200 `,
      ]}>
      

      {bookingDetails ? (
        <View>
          <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
            <Text style={tw`text-2xl font-bold mb-2 text-black`}>
              Client Information
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Client Name: {bookingDetails.clientName}
            </Text>
            <TouchableOpacity onPress={handleCallClient}>
              <Text style={tw`text-base text-blue-500 mb-2`}>
                Client Contact: {bookingDetails.clientContact}
              </Text>
            </TouchableOpacity>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Pickup Address: {bookingDetails.pickupAddress}
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Date: {bookingDetails.date}
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Time: {bookingDetails.time}
            </Text>
          </View>

          <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
            <Text style={tw`text-2xl font-bold mb-2 text-black`}>
              Service Details
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Service Name: {bookingDetails.servicesName}
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Total Price: {bookingDetails.totalPrice} INR
            </Text>
          </View>

          <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
            <Text style={tw`text-2xl font-bold mb-2 text-black`}>
              Vehicle Details
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Vehicle Number: {bookingDetails.clientvehicleno}
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Car Model Number: {bookingDetails.clientcarmodelno}
            </Text>
            <Text style={tw`text-base text-gray-800 mb-2`}>
              Location ID: {bookingDetails.locationId}
            </Text>
          </View>

          <View style={tw`flex-row justify-between mb-4`}>
            {bookingDetails.status === 'WorkOnIt' && (
              <TouchableOpacity
                style={tw`flex-1 bg-yellow-400 rounded items-center justify-center mx-1 p-2`}
                onPress={() => patchBookingStatus('PickUp')}>
                <Text style={tw`font-sans text-base text-black`}>Pick Up</Text>
              </TouchableOpacity>
            )}

            {bookingDetails.status === 'PickUp' && (
              <TouchableOpacity
                style={tw`flex-1 bg-yellow-400 rounded items-center justify-center mx-1 p-2`}
                onPress={() => patchBookingStatus('Delivered')}>
                <Text style={tw`font-sans text-base text-black`}>
                  Delivered
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Text style={tw`justify-center text-${isDarkMode ? 'white' : 'black'}`}>
          Loading...
        </Text>
      )}

      
    </View>
  );
}
