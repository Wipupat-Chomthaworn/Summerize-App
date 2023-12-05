import { StyleSheet, Text, View, TouchableOpacity, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Profile from '../screens/Profile';
import PdfReader from '../screens/PdfReader';
import CreateSumarize from '../screens/ProfileSetting';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Detail from '../screens/Detail';
import UploadPDF from '../screens/UploadPDF copy';
import { Header, Icon } from '@rneui/themed';
import CommentScreen from '../screens/Comment';
import { doc } from 'firebase/firestore';
import { FIRE_STORE } from '../../FirebaseConfig';
import FollowNavigatior from './FollowNavigator';
import Anotheruser from '../screens/AnotherUser';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { AddSalubLike, CancelLike } from '../redux/SumarizeSlice';

const Stack = createNativeStackNavigator();
const ProfileNavigator = ({ route }: any) => {
  const dispatch = useDispatch();
  const user:any = useSelector((state: RootState) => state.user);
  const sumarize: any = useSelector((state: RootState) => state.sumarize)
  const d: any = useSelector((state: RootState) => state.Detail);
  const detail: any = useSelector((state: RootState) => state.sumarize.find((item: any) => item._id == d._id));
  const alluser:any = useSelector((state:RootState) => state.alluser);

  const likesalub = (d: any, uid: any) => {
    const detail: any = sumarize.find((item: any) => item._id == d._id);
    if (detail.like.includes(user.uid)) {
      return dispatch(CancelLike({ pdfDetaill: detail, user: uid }))
    }
    return dispatch(AddSalubLike({ pdfDetaill: detail, user: uid }));
  };

  const displayname = (uid:any) =>{
    const anotheruser = alluser.find((item:any) => item.uid == uid);
    return anotheruser.displayname
  }
  // owen add this pls review
  const onShare = async (link: any) => {
    try {
      console.log("route.params: ", link);
      const result = await Share.share({
        message: link, // Replace with the URL you want to share
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
      <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="AnotherUser" component={Anotheruser} />
      {/* nav to upload */}
      <Stack.Screen name='Upload' component={UploadPDF}
        options={({ route }: any) => ({ title: route.params.title })}
      />

      <Stack.Screen name="Detail" component={Detail} options={({ route }: any) => ({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              {detail.like.includes(user.uid) ?
                <Icon name="heart" type='ionicon' size={24} color="red" style={{ marginRight: 10 }}
                  onPress={() => likesalub(detail, user.uid)} />
                :
                <Icon name="heart-outline" type='ionicon' size={24} color="black" style={{ marginRight: 10 }}
                  onPress={() => likesalub(detail, user.uid)} />
              }
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="share-outline" type='ionicon' size={24} color="black" style={{ marginRight: 10 }}
                onPress={() => onShare(d.file.url)} />
            </TouchableOpacity>
          </View>
        ),
      })} />
      <Stack.Screen name="PdfReader" component={PdfReader} options={({ route, navigation }: any) => ({
        title:route.params.pdf.name,
        headerRight: () => (
          <TouchableOpacity onPress={() => onShare(route.params.pdf.file.url)}>
            <Icon name="share-outline" type='ionicon' size={25} color="black" />
          </TouchableOpacity>
        )
      })} />
      <Stack.Screen name="ProfileSetting" component={CreateSumarize} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="Followpage" component={FollowNavigatior} options={{headerTitle: user.displayname}}/>
      <Stack.Screen name="Followpageanotheruser" component={FollowNavigatior} options={({route}:any)=> ({headerTitle:displayname(route.params.uid)})}/>
      <Stack.Screen name="Anotheruser" component={Anotheruser} options={({route}:any)=> ({headerTitle:displayname(route.params.uid)})} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator

const styles = StyleSheet.create({})