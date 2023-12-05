import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import { useDispatch, useSelector } from 'react-redux';
import PdfThumbnail from "react-native-pdf-thumbnail";
import axios, { all } from 'axios';
import { FIRE_STORE } from '../../FirebaseConfig';
import { arrayRemove, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { storeuserdata } from '../redux/userSlice';
import { storeFavSumarize } from '../redux/FavSumarizeSlice';
import { storeDetailSumarize } from '../redux/DetailSlice';

const windowWidth = Dimensions.get('window').width;
const BookList = ({ navigation, route, searchQuery }: any) => {
  const user = useSelector((state: any) => state.user);
  const allsumarize = useSelector((state: any) => state.sumarize);
  const [manageState, setManageState] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const favsumarize = allsumarize.filter((sumarize: any) => {
      return user.listsumarize.some((itemuser: any) => itemuser.includes(sumarize._id));
    });

    // Filter the selectedItems based on the searchQuery
    const filteredItems = searchQuery
      ? favsumarize.filter((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : favsumarize;

    setSelectedItems(filteredItems);
  }, [user, searchQuery]);

  const onSelect = (ind: number) => {
    if (manageState) {
      const tempData = selectedItems.map((item: any, index: any) => {
        if (index === ind) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      setSelectedItems(tempData);
    }
  };
  const handleClearSelection = () => {
    const tempData = selectedItems.map((item: any) => {
      return { ...item, selected: false };
    });
    setSelectedItems(tempData);
    setManageState(false);
  };
  const savemanage = async () => {
    const filterdel = selectedItems.filter((item: any) => item.selected);
    const del: any = filterdel.map((item: any) => item._id);
    await updateDoc(doc(FIRE_STORE, "Users", user.uid), {
      listsumarize: arrayRemove(...del)
    });
    setManageState(false);
  }

  const navigatetopdfReader = (item: any) => {
    console.log("PDF form CollectionScreen", item);
    navigation.navigate('PdfReader', { pdf: item.file.url, name: item.name });
  };

  const navigationtodetail = (item: any) => {

    dispatch(storeDetailSumarize(item))
    navigation.navigate("DetailforHome")
  }
  // Render item for FlatList
  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity onPress={() => manageState ? onSelect(index) : navigatetopdfReader(item)} onLongPress={()=> manageState == false && navigationtodetail(item)}>
        <View style={styles.bookContainer}>
          <View style={{ borderColor: 'black', borderWidth: 0.3 }}>
            <Image source={{ uri: item.img.url }} style={[styles.bookImage, { borderColor: item.selected == true ? 'green' : 'white', borderWidth: item.selected ? 2 : 0 }]} />
          </View>

          <Text style={styles.bookTitle}>{item.name.replace(/ /g, '\n')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => manageState ? savemanage() : null}
          >
            <Text style={{ color: '#6667AB', fontSize: 18, fontWeight: 'bold', paddingRight: 30 }}>{manageState ? "ลบ" : ""}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => manageState == false ? setManageState(!manageState) : handleClearSelection()}
        >
          <Text style={{ color: !manageState ? "#0074e4" : '#e53935', fontSize: 18, fontWeight: 'bold' }}>{!manageState ? "จัดการสรุป" : "ยกเลิก"}</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={selectedItems}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        numColumns={3} // Display four columns
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#6667AB',
  },
  bookContainer: {
    marginBottom: 16,
    flex: 1,
    padding: 15,
    alignItems:'center'
  },
  bookImage: {
    width: (windowWidth) / 4, // Adjust the width based on the number of columns
    height: 180,
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
  }
});

export default BookList;