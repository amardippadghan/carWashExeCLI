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
import {PERMISSIONS, request, check} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import tw from 'twrnc';

export default function OnGoingBookingDetails({route}) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {booking} = route.params;
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(booking);
  const [isTrackingActive, setIsTrackingActive] = useState(false);

  const handleCallClient = () => {
    const phoneNumber = bookingDetails.clientContact;
    Linking.openURL(`tel:+91${phoneNumber}`);
  };

  const patchBookingStatus = async status => {
    try {
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

  useEffect(() => {
    let isFetchingLocation = false;
    let locationInterval;

    const checkLocationPermission = async () => {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status === 'granted') {
        startLocationInterval();
      } else {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result === 'granted') {
          startLocationInterval();
        } else {
          console.error('Location permission denied.');
        }
      }
    };

    const startLocationInterval = () => {
      locationInterval = setInterval(() => {
        if (!isFetchingLocation && isTrackingActive) {
          isFetchingLocation = true;
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setCurrentLocation({latitude, longitude});
              console.log(latitude);
              console.log(longitude)
              patchLocation({latitude, longitude});
            },
            error => {
              console.error('Error getting location:', error);
            },
            {enableHighAccuracy: true}, // Adjust the timeout to 4 minutes (240000 milliseconds)
          );
        }
      }, 10000); // Set interval to 10 seconds (10000 milliseconds)
    };


    const patchLocation = ({latitude, longitude}) => {
      const patchData = {
        location: {latitude, longitude},
        AgentID: bookingDetails.agentId,
        bookingID: [bookingDetails._id],
        lastSeen: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };

      axios
        .patch(
          `https://car-wash-backend-api.onrender.com/api/agentlocation/${bookingDetails.locationId}`,
          patchData,
        )
        .then(response => {
          isFetchingLocation = false;
          console.log(response.data);
          if (response.status == 200) {
            console.log('succesfully patched ');
          }
        })
        .catch(error => {
          console.error('Error patching location:', error);
          isFetchingLocation = false;
        });
    };

    checkLocationPermission();

    return () => {
      clearInterval(locationInterval);
    };
  }, [isTrackingActive]);

  const startTrackingLocation = () => {
    setIsTrackingActive(!isTrackingActive);
  };

  return (
    <View
      style={[
        tw`flex-1 p-4 pt-10 `,
        isDarkMode ? tw`bg-gray-800` : tw`bg-gray-300 `,
      ]}>
      <TouchableOpacity
        style={[
          tw`w-15 h-15 mb-3 rounded-2xl items-center justify-center self-end`,
          isTrackingActive ? tw`bg-red-500` : tw`bg-blue-500`,
        ]}
        onPress={startTrackingLocation}>
        <Text style={tw`font-sans text-sm text-black`}>
          {isTrackingActive ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>

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

      {currentLocation ? (
        <View style={tw`mt-5`}>
          <Text
            style={tw`text-base text-${
              isDarkMode ? 'green-300' : 'green-500'
            }`}>
            Current Latitude: {currentLocation.latitude}
          </Text>
          <Text
            style={tw`text-base text-${
              isDarkMode ? 'green-300' : 'green-500'
            }`}>
            Current Longitude: {currentLocation.longitude}
          </Text>
        </View>
      ) : (
        <View style={tw`mt-5`}>
          <Text
            style={tw`text-base text-${isDarkMode ? 'red-500' : 'red-500'}`}>
            Location is not available
          </Text>
        </View>
      )}
    </View>
  );
}
