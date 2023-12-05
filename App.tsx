import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import FirstNavigator from './src/navigator/FirstNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <FirstNavigator></FirstNavigator>
    </Provider>
    
  );
}