import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React from 'react'
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Subcribe = () => {
  return (
    <View style={styles.container}>
      
    </View>
  )
}

export default Subcribe

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin:50
  },
  buttonContainer: {
    flex: 1, // Use flex to center vertically
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically
  }
})
