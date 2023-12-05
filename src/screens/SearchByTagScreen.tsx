import { MultipleSelectList } from 'react-native-dropdown-select-list';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { storeDetailSumarize } from '../redux/DetailSlice';



const SearchByTagScreen = ({navigation}:any) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const tagcategories = useSelector((state: any) => state.tagcategories);

  const data = useSelector((state:any) => state.sumarize);
  const dispatch = useDispatch();
  const transformedCategories = tagcategories.map((category: any, index:any) => ({
    id: index,
    value: category.tagname
  }));

  useEffect(() => {
    // Filter items based on selected categories from data
    // const filteredItems = transformedCategories.filter((item:any) => selected.includes(item.value));
    // Find items with tags matching selected categories in filteredItems
    console.log(selected);
    const filteredData = data.filter((item:any) => item.tag.some((tag:any) => selected.includes(tag.tagname)));
    setFilteredData(filteredData);
  }, [selected]);

  const navigationtodetail = (item:any) => {
    dispatch(storeDetailSumarize(item))
    navigation.navigate("DetailforHome")
    // setFilteredData([]);
  }
  return (
    <View style={styles.container}>
      <MultipleSelectList
        setSelected={(val: string[]) => val ? setSelected(val) : null}
        data={transformedCategories}
        save="key"
        label="Categories"
        placeholder='ค้นหา'
        badgeStyles={{ backgroundColor: '#6667ab' }}
      />
      <FlatList
        numColumns={2}
        data={filteredData}
        keyExtractor={(item:any, index) => index.toString()}
        renderItem={({ item }:any) => (
          <View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: 'white',
    color: 'white',
  },
  SalubContainer: {
    display: 'flex',
    width: 80,
    height: 216,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    gap: 20,
    flexShrink: 0,
    textAlign: 'center',
    margin: 50,
  },
  SalubImg: {
    width: 130,
    height: 201,
    borderRadius: 16,
  },
});

export default SearchByTagScreen;
