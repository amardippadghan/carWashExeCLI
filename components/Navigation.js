import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="History" component={HistoryPage} />
        <Stack.Screen name="profile" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;