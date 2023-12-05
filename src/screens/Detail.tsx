import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import Pdf from 'react-native-pdf';
import { Button, Chip } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Icon, color } from '@rneui/base';
import axios, { all } from 'axios';
import { Octicons } from '@expo/vector-icons';
import { collection, doc, getDoc, onSnapshot, query, where, updateDoc, arrayUnion, Firestore, arrayRemove } from 'firebase/firestore';
import { FIRE_STORE } from '../../FirebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { storeownerSummary } from '../redux/ownerSumarizeSlice';
import data from '../model/data';
import { RootState } from '../redux/store';
import { storecommentsumarize } from '../redux/CommentSumarizeSlice';
import DonationScreen from '../components/DonationScreen';
import { storeviewdata } from '../redux/ViewSlice';


const Detail = ({ route, navigation }: any) => {
  const alluser = useSelector((state: RootState) => state.alluser);
  const d: any = useSelector((state: RootState) => state.Detail);
  const dispatch = useDispatch();
  const [comment, setcomment] = useState<any[]>([]);
  const [view, setview] = useState<any>(null);
  const [authorsumarize]: any = alluser.filter((item: any) => item.uid == d.author);
  const Follow: any = useSelector((state: RootState) => state.follow.find((item: any) => item.uid == d.author));
  const [isModalVisible, setModalVisible] = useState(false);
  const detail: any = useSelector((state: RootState) => state.sumarize.find((item: any) => item._id == d._id));
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const commentquery = query(collection(FIRE_STORE, "Comments"), where("sumarize", "==", detail._id));
    const unsubscribe = onSnapshot(commentquery, (querySnapshot) => {
      // console.log("ทำอีกเเล้ว1")
      // comment ทั้งหมด
      const allcomment = querySnapshot.docs.map((doc: any) => ({ ...doc.data() }))
      // comment ใน สรุป
      const comment_insumarize = allcomment.map((item: any) => {
        const matchedUser = alluser.find((item2) => item.uid === item2.uid);
        if (matchedUser) {
          // If a matching user is found, update the uid property
          return { ...item, uid: matchedUser };
        }
      });
      setcomment(comment_insumarize);
      dispatch(storecommentsumarize(comment_insumarize));
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [alluser])

  useEffect(() => {
    const commentquery = doc(FIRE_STORE, "view", detail._id);
    const viewsub = onSnapshot(commentquery, (querySnapshot) => {
      // console.log("ทำอีกเเล้ว2")
      setview(querySnapshot.data());
      dispatch(storeviewdata(querySnapshot.data()));
    });
    return () => {
      if (viewsub) {
        viewsub();
      }
    };
  }, [])

  const pdfDetaill = d;
  const user = useSelector((state: any) => state.user)

  const AddToCollectionHandler = async () => {
    setIsLoading(true);
    try {
      const userDocRef = doc(FIRE_STORE, "Users", user.uid);
      const viewDocRef = doc(FIRE_STORE, "view", detail._id);
      await updateDoc(userDocRef, {
        listsumarize: arrayUnion(pdfDetaill._id)
      });

      await updateDoc(viewDocRef, {
        listuser: arrayUnion(user.uid)
      });
      setIsLoading(false);
      console.log("Added to Collection", d._id);
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding to collection:", error);
    }
  };

  const gotoprofile = () => {
    if (authorsumarize.uid == user.uid) {
      navigation.navigate("Profile");
    }
    else
      navigation.navigate("Anotheruser", { uid: authorsumarize.uid });
  }

  const follow = async () => {
    try {
      const userDocRef = doc(FIRE_STORE, "follow", user.uid);
      const anotherUserDocRef = doc(FIRE_STORE, "follow", authorsumarize.uid);

      // Check if the user is already following someone
      if (Follow.follower.includes(user.uid) && Follow.follower.length != 0) {
        console.log("hello")
        // If user is already following, remove user.uid from both arrays
        await updateDoc(userDocRef, {
          following: arrayRemove(authorsumarize.uid),
        });
        await updateDoc(anotherUserDocRef, {
          follower: arrayRemove(user.uid),
        });
        console.log("Removed from follower", authorsumarize.uid);
      } else {
        // If user is not following, add user.uid to both arrays
        await updateDoc(userDocRef, {
          following: arrayUnion(authorsumarize.uid),
        });
        await updateDoc(anotherUserDocRef, {
          follower: arrayUnion(user.uid),
        });
        console.log("Added to follower", authorsumarize.uid);
        console.log("ken")
      }
    } catch (error) {
      console.error("Error updating Firestore documents:", error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pdfContainer}>
        <Pdf page={1} trustAllCerts={false} style={styles.pdf} horizontal source={{uri:detail.file.url}}></Pdf>
        {/* <Pdf page={1} trustAllCerts={false} style={styles.pdf} horizontal source={require('../model/sample.pdf')}></Pdf> */}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {/* <Owen></Owen> */}
        <Button
          title="บันทึกลงสรุปที่ชอบ"
          buttonStyle={{
            borderColor: '#6667AB',
            borderRadius: 20,
          }}
          type="outline"
          titleStyle={{ color: '#6667AB' }}
          containerStyle={{
            width: 170,
            marginHorizontal: 10,
            marginVertical: 20,
          }}
          onPress={() =>
            // console.log('Add to fav');
            // console.log("PDF ID = ", d._id)
            AddToCollectionHandler()
          }
        />
        <Button
          title="Donate"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          titleStyle={{ color: "white" }}
          buttonStyle={{
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          containerStyle={{
            height: 50,
            width: 170,
            marginHorizontal: 10,
            marginVertical: 20,
          }}
          onPress={toggleModal} // Call toggleModal to show the modal
        />
      </View>
      <DonationScreen isModalVisible={isModalVisible} toggleModal={toggleModal} user={user} />
      {detail.description && (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>คำอธิบายสรุป</Text>
          <Text>{detail.description}</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row' }}>
        <FlatList
          data={detail.tag}
          keyExtractor={(item: any) => item.id}
          scrollEnabled={false}
          numColumns={4}
          renderItem={({ item }) => (
            <Chip title={item.tagname} containerStyle={{ marginVertical: 15, marginHorizontal: 10 }} color={"#6667AB"} titleStyle={{ color: 'white' }} />
          )}
        />
      </View>
      <View style={{ height: 100, backgroundColor: 'white' }}>
        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
          <View style={{ width: 100, height: 100, flexDirection: 'row', alignItems: 'center', margin: 5 }}>
            <TouchableOpacity onPress={() => gotoprofile()}>
              <Image style={{ width: 80, height: 80, borderRadius: 150 / 2, marginLeft: 10 }}
                source={authorsumarize.imageuser && authorsumarize.imageuser.url ? { uri: authorsumarize.imageuser?.url } : require('../../assets/default-avatar.png')}></Image>
            </TouchableOpacity>
            {/* <Text>{JSON.stringify(author[0].imageuser.url)}</Text> */}
            <View style={{ paddingLeft: 20 }}>
              <Text style={{ fontWeight: 'bold', width: 200, color: 'black', fontSize: 18 }}>{authorsumarize.displayname}</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Icon name="book" type='font-awesome' size={22} color="#6667AB" />
                <Text style={{ marginHorizontal: 10 }}>{view?.listuser?.length}</Text>
                <View>
                  <Octicons name="feed-heart" size={22} color="#EF3240" />
                </View>
                <Text style={{ marginHorizontal: 10, color: 'black' }}>{detail.like.length}</Text>
              </View>
            </View>
            <View style={{ justifyContent: 'center' }}>
              {authorsumarize.uid != user.uid ?
                <TouchableOpacity style={styles.ButtonETC} onPress={follow}>
                  <Text style={{ color: 'white' }}>{Follow.follower.includes(user.uid) ? "เลิกติดตาม" : "ติดตาม"}</Text>
                </TouchableOpacity> : null
              }
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
        <Text style={{ textAlign: 'left', fontSize: 20 }}>Comment</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CommentScreen", { comment, id: detail._id })}>
          <Text>{comment.length == 0 ? "comment" : "View all"}</Text>
        </TouchableOpacity>
      </View>
      {comment.map((comment, index) => {
        return (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", height: 100, padding: 20, borderTopWidth: 5, borderColor: 'rgba(218, 218, 218, 0.2)' }}>
            <View style={{ width: 200 }}>
              <Text>{comment.comment}</Text>
              <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                {/* <TouchableOpacity style={{ marginHorizontal: 10 }}>
                  <Octicons name="feed-heart" size={22} color="black" />
                </TouchableOpacity>
                <Text style={{ padding: 2 }}>1000</Text> */}
              </View>

            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{marginTop:10}}>
                <Text>{comment.uid.displayname}</Text>
                <Text>{comment.date.replace(" ", "\n")}</Text>
              </View>
              <Image source={comment.uid.imageuser.url  && comment.uid.imageuser ? { uri: comment.uid.imageuser.url } : require("../../assets/default-avatar.png")} style={styles.picture} />
            </View>
          </View>
        );
      })}
      <Modal visible={isLoading} transparent={true}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="black" />
          <Text>Uploading...</Text>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </ScrollView>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfContainer: {
    width: '100%',
    height: 500,
    alignItems: 'center',
  },
  pdf: {
    alignSelf: 'center',
    width: 400,
    height: 500,
  },
  picture: {
    width: 40, height: 40, borderRadius: 150 / 2, borderColor: 'white', borderWidth: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  ButtonETC: {
    width: 100,
    height: 45,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
})