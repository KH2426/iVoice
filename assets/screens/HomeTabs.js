// File: HomeTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SettingsPage from './SettingsPage';
import AccountPage from './AccountPage';
import Home1Page from './Home1Page'; // Make sure this path matches your folder structure
import Translate from './Translate';
import Translate1 from './Translate1';
import ConversationPage from './ConversationPage';
import HistoryPage from './HistoryPage'; // Adjust path if needed

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Translate') {
          iconName = focused ? 'globe' : 'globe-outline';
        } else if (route.name === 'Conversation') {
          iconName = focused ? 'chatbox' : 'chatbox-outline';
        } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline'; // Add this line
            }
  
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1e90ff',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 70,
        paddingBottom: 10,
        paddingTop: 5,
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      },
    })}
  >
    <Tab.Screen name="Home" component={Home1Page} /> 
    <Tab.Screen name="Translate" component={Translate} />
    <Tab.Screen name="Translate1" component={Translate1} />
    <Tab.Screen name="Conversation" component={ConversationPage} />
    <Tab.Screen name="History" component={HistoryPage} />
  </Tab.Navigator>
  
  );
};


export default HomeTabs;
