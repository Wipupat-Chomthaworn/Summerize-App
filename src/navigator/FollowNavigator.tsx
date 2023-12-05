import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowerScreen from '../screens/FollowerScreen';
import FollowingScreen from '../screens/FollowingScreen';

const Tab = createMaterialTopTabNavigator();

function FollowNavigatior({route}:any) {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: { backgroundColor: "#6667ab", height: "auto", paddingTop: 35 },
      tabBarLabelStyle: { fontSize: 15, fontWeight: "bold", color: "white" }
    }}>
      <Tab.Screen name="ผู้ติดตาม" component={FollowerScreen} initialParams={{uid:route.params.uid}}/>
      <Tab.Screen name="กำลังติดตาม" component={FollowingScreen} initialParams={{uid:route.params.uid}}/>

    </Tab.Navigator>

  );
}

export default FollowNavigatior;
