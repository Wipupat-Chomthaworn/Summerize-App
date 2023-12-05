import { Alert, Share, StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PdfReader from '../screens/PdfReader';
import BookList from '../screens/BookList'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/base';
const Stack = createNativeStackNavigator();
const CollectionNavigator = () => {
  const [search, setseatch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // owen add this pls review
  const onShare = async (link: any) => {
    try {
      console.log("route.params: ", link);
      const result = await Share.share({
        message: link.pdf, // Replace with the URL you want to share
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
      {/* <Stack.Screen name='ListCollection' component={ListCollection} options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="BookList"
        options={({ route }: any) => ({
          title:'',
          headerLeft: () => (
            <TextInput
              style={styles.inputStyle}
              placeholder="ค้นหา"
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
          ),
        })}
      >
        {props => <BookList {...props} searchQuery={searchQuery} />}
      </Stack.Screen>
      <Stack.Screen name="PdfReader" component={PdfReader} options={({ route, navigation }: any) => ({
        title:route.params.name,
        headerRight: () => (
          <TouchableOpacity onPress={() => onShare(route.params)}>
            <Icon name="share-outline" type='ionicon' size={25} color="black" />
          </TouchableOpacity>
        )
      })} />
    </Stack.Navigator>
  )
}

export default CollectionNavigator

const styles = StyleSheet.create({
  inputStyle: {
    padding: 10
  },
});
