import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { PERMISSIONS, request, check } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export default function OnGoingBookingDetails({ route }) {
  const { booking } = route.params;
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTrackingActive, setIsTrackingActive] = useState(false); // State to track location tracking status

  const handleCallClient = () => {
    const phoneNumber = booking.clientContact;
    Linking.openURL(`tel:+91${phoneNumber}`);
  };

  const patchBookingStatus = async (status) => {
    try {
      const response = await axios.patch(
        `https://car-wash-backend-api.onrender.com/api/bookings/${booking._id}`,
        { status }
      );
      setBookingDetails(response.data);
      Alert.alert(
        status === 'PickUp'
          ? 'Great, Status updated to Car is Pickup Now'
          : 'Great Job, Task completed'
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
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ latitude, longitude });
              console.log(latitude, longitude)
              patchLocation({ latitude, longitude });
            },
            (error) => {
              console.error('Error getting location:', error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        }
      }, 5000);
    };

    const patchLocation = ({ latitude, longitude }) => {
      const patchData = {
        location: { latitude, longitude },
        AgentID: booking.agentId,
        bookingID: [booking._id],
        lastSeen: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };

      axios
        .patch(
          `https://car-wash-backend-api.onrender.com/api/agentlocation/${booking.locationId}`,
          patchData
        )
        .then((response) => {
          console.log('Location patched successfully:', response.data);
          isFetchingLocation = false;
        })
        .catch((error) => {
          console.error('Error patching location:', error);
          isFetchingLocation = false;
        });
    };

    checkLocationPermission();

    // Clear the location interval when the component unmounts
    return () => {
      clearInterval(locationInterval);
    };
  }, [isTrackingActive]);

  const startTrackingLocation = () => {
    // Start or stop tracking the location by toggling isTrackingActive
    setIsTrackingActive(!isTrackingActive);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isTrackingActive ? 'red' : '#3498db',
            alignSelf: 'flex-end',
          },
        ]}
        onPress={startTrackingLocation}
      >
        <Text style={styles.buttonText}>
          {isTrackingActive ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>
      {booking ? (
        <View>
         

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Client Information</Text>
            <Text style={styles.text}>Client Name: {booking.clientName}</Text>
            <TouchableOpacity onPress={handleCallClient}>
              <Text style={styles.phoneNumber}>Client Contact: {booking.clientContact}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Pickup Address: {booking.pickupAddress}</Text>
            <Text style={styles.text}>Date: {booking.date}</Text>
            <Text style={styles.text}>Time: {booking.time}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Service Details</Text>
            <Text style={styles.text}>Service Name: {booking.servicesName}</Text>
            <Text style={styles.text}>Total Price: {booking.totalPrice} INR</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            <Text style={styles.text}>Vehicle Number: {booking.clientvehicleno}</Text>
            <Text style={styles.text}>Car Model Number: {booking.clientcarmodelno}</Text>
            <Text style={styles.text}>Location ID: {booking.locationId}</Text>
          </View>

          <View style={styles.buttonContainer}>
            {booking.status === 'WorkOnIt' && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FFD369' }]}
                onPress={() => patchBookingStatus('PickUp')}
              >
                <Text style={styles.buttonText}>Pick Up</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'PickUp' && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FFD369' }]}
                onPress={() => patchBookingStatus('Delivered')}
              >
                <Text style={styles.buttonText}>Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Text style={{ justifyContent: 'center' }}>Loading...</Text>
      )}

      {currentLocation && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Current Latitude: {currentLocation.latitude}</Text>
          <Text style={styles.locationText}>Current Longitude: {currentLocation.longitude}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D8D8D8',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#FFFFFF',
    marginHorizontal: 6,
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#000000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  locationContainer: {
    marginTop: 20,
  },
  locationText: {
    fontSize: 16,
    color: 'green',
  },
});