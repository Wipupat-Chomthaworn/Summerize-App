import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import CollectionNavigator from './CollectionNavigatior';
import Subcribe from '../screens/Subcribe';
import { Header, Icon } from '@rneui/themed';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';
import Detail from '../screens/Detail';
import BookList from '../screens/BookList';
import PdfReader from '../screens/PdfReader';
import Notification from '../screens/NotificationScreen';
import SearchNavigator from './SearchNavigator';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }: RouterProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name='SUMARIZE'
        component={HomeNavigator}
        options={{
          tabBarLabel:'หน้าหลัก',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <Icon name='home' size={30} color={focused ? '#6667AB' : 'gray'} />
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('SUMARIZE', { screen: 'Home' });
          },
        })}
      />
      <Tab.Screen name='search' component={SearchNavigator}
        options={{
          title:'Search',
          tabBarLabel:'ค้นหา',
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitleStyle: { color: '#6667AB', fontWeight: 'bold', fontSize: 40, fontFamily:'Hoefler Text' },
          tabBarIcon: ({ color, size, focused }) => <Icon name="search" size={25} color={focused ? '#6667AB' : 'gray'} style={{ marginRight: 10 }} />
        }} />
      <Tab.Screen name="Categories" component={CollectionNavigator}
        options={{
          title:'สรุปที่ชื่นชอบ',
          tabBarLabel:'สรุปที่ชื่นชอบ',
          headerTitleAlign: 'left',
          headerShown: true,
          headerTitleStyle: { color: '#6667AB', fontWeight: 'bold' },
          tabBarIcon: ({ color, size, focused }) => <Icon name='book' type='font-awesome' size={25} color={focused ? '#6667AB' : 'gray'} />
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('Categories', { screen: 'BookList' });
          },
        })} 
      />
      <Tab.Screen name='ProfileNavigator' component={ProfileNavigator}
        options={{
          tabBarLabel:'โปรไฟล์',
          headerShown: false,
          headerTitleAlign: 'left',
          headerTitleStyle: { color: '#6667AB', fontWeight: 'bold' },
          tabBarIcon: ({ color, size, focused }) => <Icon name='user' type='font-awesome' size={25} color={focused ? '#6667AB' : 'gray'} />
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('ProfileNavigator', { screen: 'Profile' });
          },
        })} 
      />
    </Tab.Navigator>
  )
}

export default MainScreen
