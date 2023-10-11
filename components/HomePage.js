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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
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
    // console.warn(userId);
    try {
      const response = await axios.get(
        `https://car-wash-backend-api.onrender.com/api/bookings/agentId/${userId}`,
      );
      setBookings(response.data);
      // console.warn(bookings);
    } catch (error) {
      console.warn('Error fetching data: ', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const renderBookingCard = booking => {
    const handleViewMore = () => {
      navigation.navigate('BookingDetailsScreen', {bookingId: booking._id});
    };

    return (
      <View style={styles.cardContainer} key={booking._id}>
        <View style={styles.bookingInfo}>
          <Text style={styles.clientName}>{booking.clientName}</Text>
          <Text style={styles.clientName}>
            Service : {booking.servicesName}
          </Text>

          <Text style={{color: '#000'}}>
            PickUp Address : {booking.pickupAddress}
          </Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.date}>{booking.date}</Text>
            <Text style={styles.time}>{booking.time}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={handleViewMore}>
          <Text style={styles.viewMoreButtonText}>View More</Text>
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
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Service Name or By Date"
        placeholderTextColor="#000"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <ScrollView
          style={styles.cardScrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }>
          <View style={styles.cardsContainer}>
            {filteredBookings.length === 0 ? (
              <Text style={styles.noTaskText}>No task is allocated</Text>
            ) : (
              filteredBookings.map(booking => renderBookingCard(booking))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookingInfo: {
    flex: 1,
    padding: 16,
  },
  clientName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    fontSize: 18,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  date: {
    marginRight: 8,
    color: '#000000',
    fontSize: 16,
  },
  time: {
    color: '#000000',
    fontSize: 16,
  },
  viewMoreButton: {
    backgroundColor: '#FFD369',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  viewMoreButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  searchBar: {
    height: 40,
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  cardScrollView: {
    flex: 1,
  },
  cardsContainer: {
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  noTaskText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
});

export default HomePage;