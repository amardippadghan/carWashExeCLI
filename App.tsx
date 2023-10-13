import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigation from "./components/BottomTabNavigation";
import AgentInfoPage from "./components/AgentInfoPage";
import BookingDetailsScreen from "./components/BookingDetails";

import LoginScreen from "./components/Login";
import Login2 from "./components/Login2";
import ViewMorePage from "./components/ViewMorePage";
import ViewHistory from "./components/ViewMore";
import OnGoingBooking from "./components/OnGointBookingDetails";
import EditProfile from "./components/EditProfile";
import ProfilePage from "./components/ProfilePage";

const Stack = createStackNavigator();

const App = () => {

    useEffect(()=>{
      console.log("running")

    })



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Login2" component={Login2} />
        <Stack.Screen name="signup" component={AgentInfoPage} />
        <Stack.Screen name="Home" 
        options={{headerShown:false}}
        initialParams={{
          initialRouteName: "Home",
        }}
        //@ts-ignore
        initialRouteName="Home"
        //@ts-ignore
        screenOptions={{headerShown:false}}component={BottomTabNavigation} />
        <Stack.Screen
          name="BookingDetailsScreen"
          component={BookingDetailsScreen}
        />
        <Stack.Screen name="ongoingbooking" component={OnGoingBooking}/>
        <Stack.Screen name="ViewMore" component={ViewMorePage} />
        <Stack.Screen name="ViewMore_history" component={ViewMorePage} />
        <Stack.Screen name="editProfile" component={EditProfile}/>
        <Stack.Screen name="ProfilePage" component={ProfilePage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;