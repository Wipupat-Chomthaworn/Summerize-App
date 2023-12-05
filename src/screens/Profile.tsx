import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, Button, Pressable, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { storeDetailSumarize } from '../redux/DetailSlice';
import { BottomSheet } from '@rneui/themed';
import { ListItem } from '@rneui/base';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FIRE_STORE } from '../../FirebaseConfig';
const windowWidth = Dimensions.get('window').width;
const Profile = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const osumarize = useSelector((state: any) => state.ownersumarize);
  const follow = useSelector((state: RootState) => state.follow);
  const [ownersumarize, setownersumarize] = useState<any[]>(osumarize);
  const [follower, setfollower] = useState<any[]>();
  const [following, setfollowing] = useState<any[]>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setownersumarize(osumarize);
    const followuser: any = follow.find((follow: any) => follow.uid == user.uid)
    setfollower(followuser?.follower);
    setfollowing(followuser?.following);
  }, [follow, osumarize])

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openBottomSheet = (item: any) => {
    setSelectedItem(item);
    setIsVisible(true);
  }
  const handleEditItem = () => {
    // You can access the selected item here in the 'selectedItem' state.
    if (selectedItem) {
      navigation.navigate("Upload", { title: "เเก้ไขสรุป", item: selectedItem })
    }
    setIsVisible(false);
  }
  // owen write this pls review
  const navigatetopdfReader = (file: any) => {
    navigation.navigate('PdfReader', { pdf: file });
  };

  const handleDeleteItem = async () => {
    const id: any = user.uid;

    if (selectedItem) {
      try {
        await deleteDoc(doc(FIRE_STORE, "Sumarize", selectedItem._id));
        await deleteDoc(doc(FIRE_STORE, "view", selectedItem._id));
        await deleteDoc(doc(FIRE_STORE, "comment", selectedItem._id));
        setIsVisible(false);
      } catch (error) {
        console.log(error)
      }
    }
    setIsVisible(false);
  }

  const sharefile = async () => {
    try {
      console.log("route.params: ", selectedItem.file.url);
      const result = await Share.share({
        message: selectedItem.file.url, // Replace with the URL you want to share
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
      setIsVisible(false);
    } catch (error: any) {
      setIsVisible(false);
      Alert.alert(error.message);
    }
  }
  const navigationtodetail = (item: any) => {

    dispatch(storeDetailSumarize(item))
    navigation.navigate("Detail")
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("ProfileSetting", { userdata: user })}>
          <Icon name="settings" type='ionicons' size={25} color="white" style={styles.icon} />
        </TouchableOpacity>
        <View style={{ flex: 12, alignContent: 'center', justifyContent: 'center' }}>
          <View style={{ width: 80, height: 80, margin: 5, flexDirection: 'row' }}>
            {/* รูปโปร์ไฟล์ */}
            <Image
              style={styles.picture}
              source={user.imageuser && user.imageuser.url ? { uri: user.imageuser.url } : require('../../assets/default-avatar.png')}
            />
            <View style={{ margin: 20 }}>
              <Text style={{ fontWeight: 'bold', width: 200, color: 'white', fontSize: 18 }}>{user.displayname}</Text>
              <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Followpage", { uid: user.uid })}>
                  <Text style={{ color: 'white', marginRight: 10 }}>ผู้ติดตาม : {follower?.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Followpage", { uid: user.uid })}>
                  <Text style={{ color: 'white' }}>กำลังติดตาม : {following?.length}</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ color: 'white', marginRight: 10, paddingTop: 4 }}>
                สรุปทั้งหมด : {ownersumarize.length}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 30 }}>สรุปของเรา</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Upload', { title: 'เพิ่มสรุป' })}>
            <Icon name="plus" type='font-awesome' size={24} color="#6667AB" style={{ marginTop: 11 }} />
          </TouchableOpacity>

        </View>
        <FlatList
          data={ownersumarize}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookContainer}>
              {/* Owen write this pls review  */}
              <TouchableOpacity onPress={() => navigationtodetail(item)} onLongPress={() => navigatetopdfReader(item)} >
                <Image source={{ uri: item.img.url }} style={styles.bookImage} />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: (windowWidth - 80) / 2, }}>
                <Text style={styles.bookTitle}>{item.name}</Text>
                <Pressable onPress={() => openBottomSheet(item)}>
                  <Icon name="share" type='evilcon' size={23} color="black" style={{ marginTop: 8 }} />
                </Pressable>
              </View>
            </View>
          )}
          numColumns={2} // Display four columns
        />
        <BottomSheet modalProps={{}} isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
          <ListItem
            onPress={() => handleEditItem()}
          >
            <ListItem.Content>
              <ListItem.Title style={{ paddingLeft: '40%' }}>แก้ไขสรุป</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            onPress={() => sharefile()}
          >
            <ListItem.Content>
              <ListItem.Title style={{ paddingLeft: '45%' }}>เเชร์</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{ backgroundColor: 'red' }}
            onPress={() => handleDeleteItem()}
          >
            <ListItem.Content>
              <ListItem.Title style={{ color: 'white', paddingLeft: '46%' }}>ลบ</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </BottomSheet>
      </View>

    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    width: "100%",
    height: 210,
    borderBottomEndRadius: 10,
    borderEndStartRadius: 10,
    backgroundColor: '#6667AB',
    padding: 20
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
    borderColor:'black',
    borderWidth:0.2
  },
  bookTitle: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: 'gray',
  },
})
