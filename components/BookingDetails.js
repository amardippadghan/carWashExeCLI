import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import axios from 'axios';

const BookingDetailsScreen = (props) => {
  const { bookingId } = props.route.params; // Access the bookingId prop
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleCallClient = () => {
    const phoneNumber = bookingDetails.clientContact;
    Linking.openURL(`tel:+91${phoneNumber}`);
  };

  useEffect(() => {
    axios
      .get(`https://car-wash-backend-api.onrender.com/api/bookings/${bookingId}`)
      .then((response) => {
        setBookingDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching booking details:', error);
      });
  }, [bookingId]);

  const handleAccept = () => {
    axios
      .patch(`https://car-wash-backend-api.onrender.com/api/bookings/${bookingId}`, { status: 'WorkOnIt' })
      .then((response) => {
        setBookingDetails(response.data);
        Alert.alert('Great, status has been changed to WorkOnIt. You can view booking info on the ongoing Tab');
      })
      .catch((error) => {
        console.error('Error updating booking status:', error);
      });
  };

  return (
    <View style={styles.container}>
      {bookingDetails ? (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Client Information</Text>
            <Text style={styles.text}>Client Name: {bookingDetails.clientName}</Text>
            <TouchableOpacity onPress={handleCallClient}>
              <Text style={styles.phoneNumber}>Client Contact: {bookingDetails.clientContact}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Pickup Address: {bookingDetails.pickupAddress}</Text>
            <Text style={styles.text}>Date: {bookingDetails.date}</Text>
            <Text style={styles.text}>Time: {bookingDetails.time}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Service Details</Text>
            <Text style={styles.text}>Service Name: {bookingDetails.servicesName}</Text>
            <Text style={styles.text}>Total Price: {bookingDetails.totalPrice} INR</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            <Text style={styles.text}>Vehicle Number: {bookingDetails.clientvehicleno}</Text>
            <Text style={styles.text}>Car Model Number: {bookingDetails.clientcarmodelno}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#FFD369' }]}
              onPress={handleAccept}
            >
              <Text style={styles.buttonText}>Work on Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={{ justifyContent: 'center' }}>Loading...</Text>
      )}
    </View>
  );
};

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
    color: 'blue', // Change text color for phone number
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
});

export default BookingDetailsScreen;
  