import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

const ViewMorePage = ({ route }) => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customerId = route.params.customer._id;
    // Replace 'API_URL' with your actual API endpoint
    const apiUrl = `https://car-wash-backend-api.onrender.com/api/bookings/${customerId}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setCustomerDetails(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customer details: ', error);
        setIsLoading(false);
      });
  }, [route.params.customer._id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  const data = [
    { label: 'Customer Name:', value: customerDetails.clientName },
    { label: 'Service:', value: customerDetails.servicesName },
    { label: 'Client Contact:', value: customerDetails.clientContact },
    { label: 'Date:', value: customerDetails.date },
    { label: 'Time:', value: customerDetails.time },
    { label: 'Total Price:', value: `₹ ${customerDetails.totalPrice}` },
    { label: 'Pickup Address:', value: customerDetails.pickupAddress },
    { label: 'Client Vehicle No:', value: customerDetails.clientvehicleno },
    { label: 'Vehical Model:', value: customerDetails.clientcarmodelno },
    { label: 'Status:', value: customerDetails.status },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex',
    alignItems: 'flex',
    backgroundColor: '#D8D8D8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 40,

    marginBottom: 16,
    marginTop : 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});

export default ViewMorePage;
