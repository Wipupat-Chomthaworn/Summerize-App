import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface UsersState {
  uid: String,
  displayname: String,
  name: String,
  lastname: String,
  email: String,
  follower: Array<Object>,
  following: Array<Object>,
  tag: Array<Object>,
  description: String,
  listsumarize: Array<String>,
  imageuser: Object
}

const SearchByNameScreen: React.FC = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState<string>('');
  const userdata = useSelector((state: RootState) => state.alluser)
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleSearch = (text: string) => {
    const filteredData = userdata.filter((item) =>
      item.displayname.toLowerCase().includes(text.toLowerCase())
    );

    setSearchText(text);
    setFilteredData(filteredData);
  };

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
          data={filteredData}
          keyExtractor={(item: any) => item.uid}
          renderItem={({ item }: any) => (
            <View>
              <TouchableOpacity style={styles.NameContainer} onPress={() => navigation.navigate("Anotheruser", { uid: item.uid })}>
                <View>
                  <Image
                    style={styles.NameImg}
                    source={item.imageuser && item.imageuser.url ? { uri: item.imageuser.url } : require('../../assets/default-avatar.png')}
                  />
                </View>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: "bold" }}>
                  {item.displayname}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  NameContainer: {
    display: 'flex',
    width: "100%",
    height: 128,
    alignItems: 'center',
    gap: 14,
    flexShrink: 0,
    backgroundColor: '#6667ab',
    flexDirection: 'row',
    borderRadius: 16,
    padding: 5,
    margin: 2,
    color: 'white',
  },
  NameImg: {
    width: 50,
    height: 50,
    borderRadius: 360,
  },
});

export default SearchByNameScreen;
