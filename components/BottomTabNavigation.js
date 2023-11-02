import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screen components
import HomePage from './HomePage';
import HistoryPage from './HistoryPage';
import OngoingPage from './Ongoing';

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      activeColor="#27374D"
      barStyle={{backgroundColor: '#FFFFD0'}}
      shifting={true}
      labeled={true}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          tabBarColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Ongoing"
        component={OngoingPage}
        options={{
          tabBarLabel: 'Ongoing',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="format-list-checks"
              color={color}
              size={26}
            />
          ),
          tabBarColor: 'green',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryPage}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="history" color={color} size={26} />
          ),
          tabBarColor: 'red',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
