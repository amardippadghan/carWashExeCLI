import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigation from "./components/BottomTabNavigation";
import AgentInfoPage from "./components/AgentInfoPage";
import BookingDetailsScreen from "./components/BookingDetails";
import LoginScreen from "./components/Login";
import Login2 from "./components/Login2";
import ViewMorePage from "./components/ViewMorePage";
import OnGoingBooking from "./components/OnGointBookingDetails";
import EditProfile from "./components/EditProfile";
import ProfilePage from "./components/ProfilePage";
import { PERMISSIONS, request, check } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";




const Stack = createStackNavigator();

const App = () => {
  const isIntervalStartedRef = useRef(false);
  const locationIntervalRef = useRef(null);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        console.log("Location permission status:", status);
        if (status === 'granted' && !isIntervalStartedRef.current) {
          startLocationInterval();
          isIntervalStartedRef.current = true;
        } else if (status !== 'granted') {
          const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          console.log("Location permission result:", result);
          if (result === 'granted' && !isIntervalStartedRef.current) {
            startLocationInterval();
            isIntervalStartedRef.current = true;
          } else {
            console.error('Location permission denied.');
          }
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    };

    const startLocationInterval = () => {
      console.log("Starting location interval.");
      let isFetchingLocation = false;
      locationIntervalRef.current = setInterval(() => {
        console.log("Inside location interval.");
        if (!isFetchingLocation) {
          isFetchingLocation = true;
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              console.log("Latitude:", latitude);
              console.log("Longitude:", longitude);
              patchLocation(latitude.toString(), longitude.toString());
              isFetchingLocation = false;
            },
            error => {
              console.error('Error getting location:', error);
              isFetchingLocation = false;
            },
            { enableHighAccuracy: true }
          );
        }
      }, 30000);
    };

    const patchLocation = async (latitude, longitude) => {
      try {
        console.log("Inside patchLocation. Latitude:", latitude, "Longitude:", longitude);
        const storedAgentId = await AsyncStorage.getItem("userId");
        const storedLocationId = await AsyncStorage.getItem("locationId");

        if (storedLocationId) {
          console.log("Location ID found: ", storedLocationId);
          const patchData = {
            location: { latitude, longitude },
            AgentID: storedAgentId,
            bookingID: [],
            lastSeen: new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };

          const response = await axios.patch(
            `http://backend.eastwayvisa.com/api/agentlocation/${storedLocationId}`,
            patchData
          );

          if (response.status === 200) {
            console.log("Successfully patched", response.data);
            const message = `Latitude: ${latitude}\nLongitude: ${longitude}\n Location updated Succesfully`;
            Alert.alert("Success", message);
          }
        } else {
          console.log("Location ID not found");
        }
      } catch (error) {
        console.error("Error patching location:", error);
      }
    };

    checkLocationPermission();

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="Login2" component={Login2} />
        <Stack.Screen name="signup" options={{ headerShown: false }} component={AgentInfoPage} />
        <Stack.Screen name="Home" options={{ headerShown: false }} initialParams={{ initialRouteName: "Home" }} component={BottomTabNavigation} />
        <Stack.Screen name="BookingDetailsScreen" options={{ headerShown: false }} component={BookingDetailsScreen} />
        <Stack.Screen name="ongoingbooking" options={{ headerShown: false }} component={OnGoingBooking} />
        <Stack.Screen name="ViewMore" component={ViewMorePage} />
        <Stack.Screen name="ViewMore_history" options={
          {
            headerShown : false 

          }
        } component={ViewMorePage} />
        <Stack.Screen name="editProfile" options={
          {
            headerShown: false
          }
        } component={EditProfile} />
        <Stack.Screen name="ProfilePage" options={{ headerShown: false }} component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;