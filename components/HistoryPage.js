import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(async () => {
    const userId = await AsyncStorage.getItem('userId');
    // console.warn(userId);
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    const userId = await AsyncStorage.getItem('userId');
    console.warn(userId);
    axios
      .get(
        `https://car-wash-backend-api.onrender.com/api/bookings/agentId/${userId}`,
      )
      .then(response => {
        // Filter the data to only include "delivered" items
        const deliveredItems = response.data.filter(
          customer => customer.status === 'Delivered',
        );
        setBookingHistory(deliveredItems);
        console.warn(deliveredItems);
      })
      .catch(error => {
        console.error('Error fetching booking history:', error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const navigateToViewMore = customer => {
    navigation.navigate('ViewMore_history', {customer});
  };

  const renderCustomerCard = customer => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        key={customer._id}
        onPress={() => navigateToViewMore(customer)}>
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>{customer.status}</Text>
        </View>
        <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer.clientName}</Text>
          <Text style={styles.customerName}>{customer.servicesName}</Text>
          <Text style={styles.customerAddress}>{customer.pickupAddress}</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.date}>{customer.date}</Text>
            <Text style={styles.time}>{customer.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Service Name or By Date"
        placeholderTextColor="#000000"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        style={styles.cardScrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchData}
            colors={['#5cb85c']}
          />
        }>
        <View style={styles.cardsContainer}>
          {/* Render filtered customer cards */}
          {bookingHistory.length === 0 ? (
            <Text style={styles.noTaskText}>No delivered tasks available</Text>
          ) : (
            bookingHistory
              .filter(
                customer =>
                  customer.servicesName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  customer.date.includes(searchQuery),
              )
              .map(customer => renderCustomerCard(customer))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  cardScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardsContainer: {
    marginTop: 16,
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
    padding: 16,
  },
  statusBar: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#5cb85c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  noTaskText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 18,
    color: '#000000',
  },
  customerAddress: {
    fontSize: 16,
    color: '#000000',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  date: {
    marginRight: 8,
    fontSize: 16,
    color: '#000000',
  },
  time: {
    fontSize: 16,
    color: '#000000',
  },
  searchBar: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default HistoryPage;
