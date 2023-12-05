import { StyleSheet, Text, View, TouchableOpacity, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Home from '../screens/Home';
import PdfReader from '../screens/PdfReader';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notification from '../screens/NotificationScreen';
import { Header, Icon } from '@rneui/themed';
import { NavigationProp } from '@react-navigation/native';
import SearchNavigator from './SearchNavigator';
import Detail from '../screens/Detail';
import CommentScreen from '../screens/Comment';
import Anotheruser from '../screens/AnotherUser';
import { useDispatch, useSelector } from 'react-redux';
import { AddSalubLike, CancelLike } from '../redux/SumarizeSlice';
import { RootState } from '../redux/store';
import Profile from '../screens/Profile';
import CollectionNavigator from './CollectionNavigatior';
import CategoriesSumarize from '../screens/CategoriesSumarize';
const Stack = createNativeStackNavigator();
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const HomeNavigator = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const d: any = useSelector((state: RootState) => state.Detail);
  const detail: any = useSelector((state: RootState) => state.sumarize.find((item: any) => item._id == d._id));

  const likesalub = (d: any, uid: any) => {
    // const detail:any = sumarize.find((item:any) => item._id == d._id);
    if (detail.like.includes(user.uid)) {
      return dispatch(CancelLike({ pdfDetaill: d, user: uid }))
    }
    return dispatch(AddSalubLike({ pdfDetaill: d, user: uid }));
  };
  const onShare = async (link: any) => {
    try {
      console.log("route.params: ", link);
      const result = await Share.share({
        message: link.url, // Replace with the URL you want to share
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("share result", result.activityType);
        } else {
          // shared
          console.log("shared result");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("shared dismiss");

      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} options={{
        headerShown: true,
        headerTitle: "",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ fontSize: 22, color: '#6667AB', fontWeight: 'bold' }}>SUMARIZE</Text>
          </TouchableOpacity>
        ),
        headerTitleAlign: 'left',
        // headerRight: () => (
        //   <View style={{ flexDirection: 'row' }}>
        //     <TouchableOpacity onPress={() => navigation.navigate("SearchNavigator")}>
        //       <Icon name="search" size={24} color="black" style={{ marginRight: 10 }} />
        //     </TouchableOpacity>
        //   </View>
        // ),
      }} />
      <Stack.Screen name="SearchNavigator" component={SearchNavigator} options={{
        headerShown: true,
        headerTitle: "",
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon name="chevron-back-outline" type='ionicon' size={30} color='black' style={{ marginRight: 10 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: '#6667AB' }}>Search</Text>
          </View>
        ),
      }} />
      <Stack.Screen name="DetailforHome" component={Detail} options={({ route }: any) => ({
        title: d.name,
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              {detail.like.includes(user.uid) ?
                <Icon name="heart" type='ionicon' size={24} color="red" style={{marginRight:10}}
                  onPress={() => likesalub(detail, user.uid)} />
                :
                <Icon name="heart-outline" type='ionicon' size={24} color="black" style={{ marginRight: 10 }}
                  onPress={() => likesalub(detail, user.uid)} />
              }
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="share-outline" type='ionicon' size={24} color="black" style={{ marginRight: 10 }}
                onPress={() => onShare(d.file)} />
            </TouchableOpacity>
          </View>
        ),
      })} />
      {/* <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Anotheruser" component={Anotheruser} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="CategoriesSumarize" component={CategoriesSumarize} options={({ route }: any) => ({
        title: route.params.tag
      })} />
    </Stack.Navigator>
  )
}

export default HomeNavigator

const styles = StyleSheet.create({})