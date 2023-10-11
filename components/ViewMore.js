import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const ViewHistory = ({ route }) => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customerId = route.params.customer._id;
    // Replace 'API_URL' with your actual API endpoint
    const apiUrl = `https://car-wash-backend-api.onrender.com/api/bookings/${customerId}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Remove 'agentId' property from the data
        const { agentId, ...filteredData } = data;
        setCustomerDetails(filteredData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customer details: ", error);
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.customerName}>{customerDetails.clientName}</Text>
        <Text style={styles.serviceName}>{customerDetails.servicesName}</Text>
        <Text style={styles.cardText}>Date: {customerDetails.date}</Text>
        <Text style={styles.cardText}>Time: {customerDetails.time}</Text>
        <Text style={styles.cardText}>
          Total Price: Rs {customerDetails.totalPrice}
        </Text>
        <Text style={styles.cardText}>
          Pickup Address: {customerDetails.pickupAddress}
        </Text>
        <Text style={styles.cardText}>
          Clinet Vehical number: {customerDetails.clientvehicleno}
        </Text>
        <Text style={styles.cardText}>
          Client Vehical Model number: {customerDetails.clientcarmodelno}
        </Text>
        <Text style={styles.cardText}>Status: {customerDetails.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#D8D8D8',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C4FCF7",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },
});

export default ViewHistory;