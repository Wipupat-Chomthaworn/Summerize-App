import { StyleSheet, Text, View, Button, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Chip } from '@rneui/base';
import { storeDetailSumarize } from '../redux/DetailSlice';
import { RootState } from '../redux/store';

const Home = ({ navigation, route }: any) => {
  // Mock data
  const data = [
    { id: '1', text: 'Item 1', picImage: require('../../assets/393614354_843287777253866_2728943627101900095_n.jpeg'), name: 'ชีววิทยา' },
    { id: '2', text: 'Item 2', picImage: require('../../assets/IMG_0FB500BF7ED0-1.jpeg'), name: 'ภาษาไทย' },
    // { id: '3', text: 'Item 2', picImage: require('../../assets/393362342_873005907766031_4609037303352012290_n.jpg'), name: 'physics' },
    { id: '4', text: 'Item 2', picImage: require('../../assets/393673346_1073169004045920_5587934476064463319_n.jpg'), name: 'เคมี' },
  ];
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const allsumarize = useSelector((state: any) => state.sumarize);
  const tagcategories = useSelector((state: any) => state.tagcategories);
  const alluser = useSelector((state: RootState) => state.alluser);
  const follow: any = useSelector((state: RootState) => state.follow.find((item: any) => item.uid == user.uid));
  const followingsalub = allsumarize.filter((item: any) => follow?.following?.some((following: any) => following == item.author));
  const useranother = alluser
    .filter((item: any) =>
      followingsalub.some((item2: any) => item.uid === item2.author)
    )
    .map((item: any) => {
      const i = followingsalub.filter((item2: any) => item.uid === item2.author);
      return { user: item, sumarize: i };
    });

  const favsumarize = allsumarize
    .filter((sumarize: any) => {
      // Check if any user in the user array includes the sumarize._id
      return user.listsumarize.some((itemuser: any) => itemuser.includes(sumarize._id));
    })

  const navigationtodetail = (item: any) => {
    dispatch(storeDetailSumarize(item))
    navigation.navigate("DetailforHome")
  }

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 26, margin: 20, color: 'black' }}>เเนะนำ</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal={true} // Set FlatList to horizontal mode
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.box1} onPress={() => navigation.navigate("CategoriesSumarize", { tag: item.name })}>
            <Image style={{ width: '100%', height: '100%' }} source={item.picImage} />
          </TouchableOpacity>
        )}
      />
      <View>
        <View style={{ margin: 20, marginTop: 30, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>เเท็กยอดฮิต</Text>
        </View>
        <FlatList
          data={shuffleArray(tagcategories.slice(1, 5))}
          keyExtractor={(item, index: number) => index.toString()}
          scrollEnabled={false}
          numColumns={4}
          renderItem={({ item }) => (
            <Chip onPress={() => navigation.navigate("CategoriesSumarize", { tag: item.tagname })} title={item.tagname} containerStyle={{ marginVertical: 15, marginHorizontal: 5 }} color={"black"} titleStyle={{ color: 'white' }} />
          )}
        />
      </View>
      {useranother.map((data: any, index: any) => {
        return (
          <View key={index}>
            <View style={{ margin: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => navigation.navigate("Anotheruser", { uid: data?.user?.uid })}>
                <Image
                  style={styles.picture}
                  source={data?.user?.imageuser && data?.user?.imageuser?.url ? { uri: data.user.imageuser.url } : require('../../assets/default-avatar.png')}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data?.user?.displayname}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={data?.sumarize}
              keyExtractor={(item) => item._id}
              horizontal={true} // Set FlatList to horizontal mode
              style={{ backgroundColor: '#ffebf7', borderRadius: 5 }}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity style={styles.box2} onPress={() => navigationtodetail(item)} >
                    <Image style={{ width: '100%', height: '100%' }} source={{ uri: item.img.url }} />
                  </TouchableOpacity>
                  <Text style={{marginBottom:10}}>{item.name}</Text>
                </View>
              )}
            />
          </View>
        );
      })}
      <View style={{ margin: 20, marginTop: 60, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>สรุปจากเเท็กที่คุณสนใจ</Text>
      </View>
      {user.tag.map((tag: any, index: any) => {
        const specifiv = allsumarize.filter((item: any) => item.tag.some((tag2: any) => tag2.tagname == tag.tagname));
        if (specifiv.length != 0)
          return (
            <View key={index} style={{ borderBottomWidth: 2, borderColor: '#faf3f0' }}>
              <View style={{ margin: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Chip title={tag.tagname} containerStyle={{}} color={"black"} titleStyle={{ color: 'white', fontSize: 18 }} />
                <TouchableOpacity onPress={() => navigation.navigate("CategoriesSumarize", { tag: tag.tagname })}>
                  <Text style={{ color: '#6667AB', fontWeight: 'bold', fontSize: 16 }}>See more</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={specifiv}
                keyExtractor={(item, index: number) => index.toString()}
                horizontal={true} // Set FlatList to horizontal mode
                style={{backgroundColor:'#fffcf9'}}
                renderItem={({ item }) => (
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.box2} onPress={() => navigationtodetail(item)} >
                      <Image style={{ width: '100%', height: '100%' }} source={{ uri: item.img.url }} />
                    </TouchableOpacity>
                    <Text>{item.name}</Text>
                  </View>

                )}
              />
            </View>
          );
      })}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 15
  },
  box1: {
    width: 250,
    height: 200,
    backgroundColor: 'lightgray',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOpacity: 6,
  },
  box2: {
    width: 130,
    height: 200,
    backgroundColor: 'lightgray',
    marginHorizontal: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  picture: {
    width: 50, height: 50, borderRadius: 150 / 2, borderColor: '#f5f1ff', borderWidth: 2
  },
});

export default Home
