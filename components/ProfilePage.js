import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,

} from "react-native";
import { Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    dateOfBirth: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the user ID from AsyncStorage
        const userId = await AsyncStorage.getItem("userId");

        if (userId) {
          // Make an API request using the retrieved user ID
          const response = await axios.get(
            `https://car-wash-backend-api.onrender.com/api/agents/${userId}`
          );

          setProfileData(response.data);
        } else {
          console.log("User ID not found in AsyncStorage");
          // Handle the case when the user ID is not found in AsyncStorage
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  const handleEdit = () => {
    navigation.navigate("editProfile" , {profileData : profileData});
  } 
  const handleLogout = async () => {
    // Clear the user ID from AsyncStorage
    await AsyncStorage.removeItem("userId");

    // Navigate to the login screen
    navigation.navigate("Login");
  };

  // Data for the agent information table
  const agentInfoData = [
    { label: "Full Name", value: profileData.fullName },
    { label: "Email", value: profileData.email },
    { label: "Contact ", value: profileData.contactNumber },
    { label: "Date of Birth", value: profileData.dateOfBirth },
    { label: "Address", value: profileData.address },
  ];

  // Function to render each row in the table
  const renderAgentInfoItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableLabel}>{item.label}</Text>
      <Text style={styles.tableValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: "https://picsum.photos/200" }}
        style={styles.profileImage}
      />
      <Text style={styles.nameText}>{profileData.fullName}</Text>
      <View style={styles.tableContainer}>
        <FlatList
          data={agentInfoData}
          keyExtractor={(item) => item.label}
          renderItem={renderAgentInfoItem}
          style={styles.table}
        />
      </View>
      <Button title="Edit Profile" onPress={handleEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#D8D8D8",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  logoutButton: {
    backgroundColor: "#FFD369",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#111",
  },
  tableContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tableLabel: {
    fontSize: 16,
    fontWeight: "bold",
    width: "40%",
    color: "#333",
  },
  tableValue: {
    fontSize: 16,
    width: "60%",
    color: "#666",
  },
});

export default ProfilePage;