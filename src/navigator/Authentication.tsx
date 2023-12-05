import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
const InsideStack = createNativeStackNavigator();


const Authentication = () => {
    return(
      <InsideStack.Navigator>
        <InsideStack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <InsideStack.Screen name='Register' component={Register} options={{headerShown:true}}/>
      </InsideStack.Navigator>
    )
}

export default Authentication

const styles = StyleSheet.create({})