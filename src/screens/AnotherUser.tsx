import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { listAll, ref } from 'firebase/storage';
import { FIRE_STORE, storage } from '../../FirebaseConfig';
import { RootState } from '../redux/store';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { storeDetailSumarize } from '../redux/DetailSlice';

const windowWidth = Dimensions.get('window').width;

const Anotheruser = ({ navigation, route }: any) => {
  const alluser = useSelector((state: RootState) => state.alluser);
  const [datauser]: any = alluser.filter((user: any) => user.uid == route.params?.uid);
  const user: any = useSelector((state: RootState) => state.user);
  const Follow: any = useSelector((state: RootState) => state.follow.find((follow) => follow.uid == user.uid));

  const anothefollow = useSelector((state: RootState) => state.follow.find((follow) => follow.uid == route.params.uid));
  const allsumarize = useSelector((state: RootState) => state.sumarize);
  const [ownersumarize, setownersumarize] = useState<any[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const ownersumarize = allsumarize.filter((sumarize: any) => sumarize.author == route.params?.uid);
    setownersumarize(ownersumarize);
  }, [])

  const subscribe = async () => {
    try {
      const userDocRef = doc(FIRE_STORE, "follow", user.uid);
      const anotherUserDocRef = doc(FIRE_STORE, "follow", route.params?.uid);

      // Check if the user is already following someone
      if (Follow.following.includes(route.params?.uid)) {
        // If user is already following, remove user.uid from both arrays
        await updateDoc(userDocRef, {
          following: arrayRemove(route.params?.uid),
        });
        await updateDoc(anotherUserDocRef, {
          follower: arrayRemove(user.uid),
        });
        console.log("Removed from follower", route.params?.uid);
      } else {
        // If user is not following, add user.uid to both arrays
        await updateDoc(userDocRef, {
          following: arrayUnion(route.params.uid),
        });
        await updateDoc(anotherUserDocRef, {
          follower: arrayUnion(user.uid),
        });
        console.log("Added to follower", route.params.uid);
      }
    } catch (error) {
      console.error("Error updating Firestore documents:", error);
    }
  };

  const navigationtodetail = (item: any) => {
    dispatch(storeDetailSumarize(item))
    navigation.navigate("DetailforHome")
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={{ flex: 12, alignContent: 'center', justifyContent: 'center' }}>
          <View style={{ width: 80, height: 80, margin: 5, flexDirection: 'row' }}>
            {/* รูปโปร์ไฟล์ */}
            <Image
              style={styles.picture}
              source={datauser.imageuser && datauser.imageuser.url ? { uri: datauser.imageuser.url } : require('../../assets/default-avatar.png')}
            />
            <View style={{ margin: 20 }}>
              <Text style={{ fontWeight: 'bold', width: 200, color: 'white', fontSize: 18 }}>{datauser?.displayname}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.navigate("Followpageanotheruser", { uid: datauser.uid })}>
                  <Text style={{ color: 'white', marginRight: 10 }}>ผู้ติดตาม : {anothefollow?.follower.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Followpageanotheruser", { uid: datauser.uid })}>
                  <Text style={{ color: 'white' }}>กำลังติดตาม : {anothefollow?.following.length}</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ color: 'white', marginRight: 10, paddingTop: 4 }}>
                สรุปทั้งหมด : {ownersumarize.length}
              </Text>
              <TouchableOpacity style={styles.ButtonETC} onPress={subscribe}>
                <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>{Follow.following.includes(datauser?.uid) ? "ยกเลิกติดตาม" : "ติดตาม"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 30 }}>สรุปของ {datauser?.displayname}</Text>
        </View>
        <FlatList

          data={ownersumarize}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigationtodetail(item)}>
              <View style={styles.bookContainer}>
                <Image source={{ uri: item.img.url }} style={styles.bookImage} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.bookTitle}>{item.name}</Text>

                </View>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2} // Display four columns
        />

      </View>

    </View>
  )
}

export default Anotheruser

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    width: "100%",
    height: 250,
    borderBottomEndRadius: 10,
    borderEndStartRadius: 10,
    backgroundColor: '#6667AB',
    padding:20
  },
  picture: {
    width: '100%', height: '100%', borderRadius: 150 / 2, borderColor: 'white', borderWidth: 4
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  icon: {
    marginTop: 10,
    marginRight: 10,
  },
  bookContainer: {
    margin: 16,
    flex: 1,
  },
  bookImage: {
    width: (windowWidth - 80) / 2, // Adjust the width based on the number of columns
    height: 250,
    borderRadius: 8,
    backgroundColor: 'lightblue',
  },
  bookTitle: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: 'gray',
  },
  ButtonETC: {
    width: 230,
    height: 45,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'black',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
})
