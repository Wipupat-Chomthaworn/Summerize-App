import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchBySalubScreen from '../screens/SearchSalubScreen';
import SearchByTagScreen from '../screens/SearchByTagScreen';
import SearchByNameScreen from '../screens/SearchByNameScreen';

const Tab = createMaterialTopTabNavigator();

function SearchNavigator() {
  return (
      <Tab.Navigator screenOptions={{
      tabBarStyle: { backgroundColor: "#6667ab", height:"auto", paddingTop: 35 },
      tabBarLabelStyle: { fontSize: 15, fontWeight: "bold", color: "white"}
    }}>
        <Tab.Screen name="ชื่อสรุป" component={SearchBySalubScreen} />
        <Tab.Screen name="ชื่อเเท็ก" component={SearchByTagScreen} />
        <Tab.Screen name="คนเขียน" component={SearchByNameScreen} />
      </Tab.Navigator>
      
  );
}

export default SearchNavigator;