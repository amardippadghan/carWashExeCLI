import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomePage from './HomePage';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';
import OngoingPage from './Ongoing';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useEffect} from 'react';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  useEffect(() => {
    console.log('running');
    return () => {
      console.log('unmount');
    };
  }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#FFD369',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tab.Screen
        name="Ongoing"
        component={OngoingPage}
        options={{
          tabBarLabel: 'Ongoing',
          tabBarIcon: ({color, size}) => (
            <Icon name="tasks" size={size} color={color} />
          ),
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryPage}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => (
            <Icon name="history" size={size} color={color} />
          ),
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" size={size} color={color} />
          ),
          headerShown: false, // Hide the header for this screen
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
