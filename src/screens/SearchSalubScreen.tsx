import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { storeDetailSumarize } from '../redux/DetailSlice';


const SearchBySalubScreen = ({navigation}:any) => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const data = useSelector((state:RootState) => state.sumarize);
  const dispatch = useDispatch();
  const handleSearch = (text: string) => {
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );

    setSearchText(text);
    setFilteredData(filteredData);
  };
  const navigationtodetail = (item:any) => {
    dispatch(storeDetailSumarize(item))
    navigation.navigate("DetailforHome")
  }

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.SearchBar}
          placeholder=" ค้นหา"
          onChangeText={handleSearch}
          value={searchText}
        />
        <FlatList
          numColumns={2}
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.BigSalubCatainer}>
              <View style={styles.SalubContainer}>
                <TouchableOpacity onPress={() =>  navigationtodetail(item)}>
                  <Image style={styles.SalubImg} source={{uri:item.img.url}} />
                </TouchableOpacity>
                <Text>{item.name}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  SalubContainer: {
    display: 'flex',
    width: 80,
    height: 216,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    gap: 8,
    flexShrink: 0,
    textAlign: 'center',
    margin: 50,
  },
  container: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SearchBar: {
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
    margin: 5,
  },
  SalubImg: {
    width: 130,
    height: 201,
    borderRadius: 16,
  },
  BigSalubCatainer: {
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'wrap-reverse',
    flex: 10,
  },
});

export default SearchBySalubScreen;
