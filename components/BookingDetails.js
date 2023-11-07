import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import tw from 'twrnc';

const BookingDetailsScreen = props => {
  const {bookingId} = props.route.params; // Access the bookingId prop
  const [bookingDetails, setBookingDetails] = useState(null);
  const colorScheme = useColorScheme();

  const handleCallClient = () => {
    const phoneNumber = bookingDetails.clientContact;
    Linking.openURL(`tel:+91${phoneNumber}`);
  };

  useEffect(() => {
    axios
      .get(
        `https://car-wash-backend-api.onrender.com/api/bookings/${bookingId}`,
      )
      .then(response => {
        setBookingDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching booking details:', error);
      });
  }, [bookingId]);

  const handleAccept = () => {
    axios
      .patch(
        `https://car-wash-backend-api.onrender.com/api/bookings/${bookingId}`,
        {
          status: 'WorkOnIt',
        },
      )
      .then(response => {
        setBookingDetails(response.data);
        Alert.alert(
          'Great, status has been changed to WorkOnIt. You can view booking info on the ongoing Tab',
        );
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  return (
    <View
      style={[
        tw`flex-1 p-4 pt-10`,
        colorScheme === 'dark' ? tw`bg-gray-800` : tw`bg-gray-200`,
      ]}>
      {bookingDetails ? (
        <View>
          <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
            <Text style={tw`text-lg font-bold mb-2`}>Client Information</Text>
            <Text style={tw`text-base`}>
              Client Name: {bookingDetails.clientName}
            </Text>
            <TouchableOpacity onPress={handleCallClient}>
              <Text style={tw`text-base text-blue-500`}>
                Client Contact: {bookingDetails.clientContact}
              </Text>
            </TouchableOpacity>
            <Text style={tw`text-base`}>
              Pickup Address: {bookingDetails.pickupAddress}
            </Text>
            <Text style={tw`text-base`}>Date: {bookingDetails.date}</Text>
            <Text style={tw`text-base`}>Time: {bookingDetails.time}</Text>
          </View>

          <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
            <Text style={tw`text-lg font-bold mb-2`}>Service Details</Text>
            <Text style={tw`text-base`}>
              Service Name: {bookingDetails.servicesName}
            </Text>
            <Text style={tw`text-base`}>
              Total Price: {bookingDetails.totalPrice} INR
            </Text>
          </View>

          <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
            <Text style={tw`text-lg font-bold mb-2`}>Vehicle Details</Text>
            <Text style={tw`text-base`}>
              Vehicle Number: {bookingDetails.clientvehicleno}
            </Text>
            <Text style={tw`text-base`}>
              Car Model Number: {bookingDetails.clientcarmodelno}
            </Text>
          </View>

          <View style={tw`flex-row justify-between mb-4`}>
            <TouchableOpacity
              style={tw`flex-1 bg-yellow-500 items-center justify-center rounded-md mx-1 p-4`}
              onPress={handleAccept}>
              <Text style={tw`text-lg text-black`}>Work on Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={tw`justify-center`}>Loading...</Text>
      )}
    </View>
  );
};

export default BookingDetailsScreen;
