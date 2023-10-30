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

  //single agent can have customers cars at multiple location?
  // one agent can have only one customer's car 
  // but cars can be multiple or single?
  // no idea about it , i am presuming that , agent have only one car 
  // did you use redux?
  // not yet 
  // async storage?
  //yes 
// you will have to write code in app.js (curent file) and check if agent id is present then you'll send coordinate to backend (agent_id and coordinates) and in backend these coordinates will be updated for all the bookings of the agent_id you sent
// in useeffect right
//yes
//same code you have alredy wrtiten
// settimeout and all
// i am using useeffect in app.js file its not runnig every time ,i console some 

    useEffect(()=>{
      console.log("running")

      let i = setInterval(() => {
        console.log(new Date())
      }, 1000)

      return () => {
        clearInterval(i)

        //try this
      }
    }, [])

// thanks i get idea about it , 
// should i give a button for on and off traking 
// i'll see in 10 minute
//ok
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