import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
const data3 = [
  { id: '1', text: 'Item 1'},
  { id: '2', text: 'Item 2'},
  { id: '3', text: 'Item 2'},
  { id: '4', text: 'Item 2'},
  { id: '5', text: 'Item 2'}
];
const Notification = () => {
  return (
    <View style={styles.container}>
      <View style={styles.boxcomment}>
        <FlatList
          data={data3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{width:'100%'}}>
              <View style={styles.comment}>
                <Text>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
  },
  boxcomment: {
    flexDirection:'row',
  },
  comment:{
    margin:10,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    height:100,
    backgroundColor:'white',
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
  }
})