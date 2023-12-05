import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { storeDetailSumarize } from '../redux/DetailSlice';
const windowWidth = Dimensions.get('window').width;
const CategoriesSumarize = ({ route, navigation }: any) => {
  const allsumarize = useSelector((state: any) => state.sumarize);
  const specifiv = allsumarize.filter((item: any) => item.tag.some((tag2: any) => tag2.tagname == route.params.tag));
  const [data, setFilteredData] = useState(specifiv);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigationtodetail = (item: any) => {
    dispatch(storeDetailSumarize(item))
    navigation.navigate("DetailforHome")
  }
  const handleSearch = (text: string) => {
    const filteredData = specifiv.filter((item: any) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );

    setSearchText(text);
    setFilteredData(filteredData);
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <View>
        <View style={styles.bookContainer}>
          <TouchableOpacity onPress={() => navigationtodetail(item)}>
            <View>
              <Image source={{ uri: item.img.url }} style={[styles.bookImage, { borderColor: item.selected == true ? 'green' : 'white', borderWidth: item.selected ? 2 : 0 }]} />
            </View>
          </TouchableOpacity>
          <Text style={styles.bookTitle}>{item.name.replace(/ /g, '\n')}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.SearchBar}
        placeholder="ค้นหา"
        onChangeText={handleSearch}
        value={searchText}
      />
      <FlatList
        data={data}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        numColumns={3} // Display four columns
      />
    </View>
  );
}

export default CategoriesSumarize


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
  SearchBar: {
    marginTop: 15,
    width: 375,
    height: 45,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    padding: 5,
  },
});