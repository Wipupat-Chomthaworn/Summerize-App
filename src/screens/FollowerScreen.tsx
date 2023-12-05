import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const FollowerScreen = ({navigation, route}:any) => {
    const Follow:any = useSelector((state:RootState) => state.follow.find((follow:any) => follow.uid == route.params.uid));
    const alluser = useSelector((state:RootState) => state.alluser);
    const [follower, setfollower] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const user = useSelector((state:RootState) => state.user);
    useEffect(()=>{
        console.log("follower : "+ route.params.uid)
        // const followuser = Follow.find((follow:any) => follow.uid == route.params.uid);
        if(Follow.follower){
            const userfollower = alluser.filter((user:any) => Follow.follower.some((follower:any) => follower === user.uid));
            setFilteredData(userfollower);
            setfollower(userfollower);
        }
    },[Follow]);

    const handleSearch = (text: string) => {
        const filteredData = follower.filter((item:any) =>
          item.displayname.toLowerCase().includes(text.toLowerCase())
        );
    
        setSearchText(text);
        setFilteredData(filteredData);
      };

    const UnFollow = (itemId:any) => {
        console.log(itemId);
        
    };

    const followernavigate = (item:any, user:any) =>{
        if(item.uid != user.uid){
            return navigation.navigate("Anotheruser", { uid: item.uid })
        }
        return navigation.navigate("Profile");
    }
    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    style={styles.SearchBar}
                    placeholder="ค้นหา"
                    onChangeText={handleSearch}
                    value={searchText}
                />
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => (
                        <View style={styles.NameContainer}>
                            <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row'}} onPress={() => followernavigate(item, user)}>
                                <View>
                                    <Image
                                        style={styles.NameImg}
                                        source={item.imageuser && item.imageuser.url ? { uri: item.imageuser.url } : require('../../assets/default-avatar.png')}
                                    />
                                </View>
                                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold", marginLeft: 10 }}>{item.displayname}</Text>
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
        width: 430,
        height: 85,
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 16,
        padding: 5,
        margin: 2,
        color: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    NameImg: {
        width: 50,
        height: 50,
        borderRadius: 360,
        borderWidth: 1,         // Border width
        borderColor: '#fff'    // Border color
    },
    ButtonETC: {
        width: 120,
        height: 28,
        borderRadius: 30,
        margin: 5,
        backgroundColor: '#6667ab',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
});

export default FollowerScreen;




// ################################################  TypeScript  ##########################################################

// import React, { useState, FC } from 'react';
// import { StyleSheet, View, TextInput, FlatList, Text, Image, Pressable, ImageSourcePropType } from 'react-native';

// interface Item {
//     id: number;
//     img: ImageSourcePropType;
//     name: string;
// }

// const FollowerScreen: FC = () => {

//     const [data, setData] = useState<Item[]>([
//         { id: 1, img: require("../assets/favicon.png"), name: 'Item 1' },
//         { id: 2, img: require("../assets/adaptive-icon.png"), name: 'Item 2' },
//         { id: 3, img: require("../assets/icon.png"), name: 'Item 3' },
//         // เพิ่มข้อมูลเพิ่มเติมที่คุณต้องการกรอง
//     ]);

    
//     return (
//         <View style={styles.container}>
//             <View>
                
//                 <FlatList
//                     data={data}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={({ item }) => (
//                         <View style={styles.NameContainer}>
                        
//                             <View style={{alignItems: 'center', flexDirection: 'row'}}>
//                                 <View><Image style={styles.NameImg} source={item.img} /></View>
//                                 <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold", marginLeft: 10 }}>{item.name}</Text>
//                             </View>
                            
//                         </View>
//                     )}
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         marginTop: 5,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     SearchBar: {
//         width: 375,
//         height: 45,
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 10,
//         borderWidth: 1,
//         borderColor: "gray",
//         borderRadius: 10,
//         alignSelf: 'center',
//         justifyContent: 'center',
//         display: 'flex',
//         padding: 5,
//     },
//     NameContainer: {
//         display: 'flex',
//         width: 430,
//         height: 85,
//         alignItems: 'center',
//         gap: 14,
//         flexShrink: 0,
//         backgroundColor: 'white',
//         flexDirection: 'row',
//         borderRadius: 16,
//         padding: 5,
//         margin: 2,
//         color: 'white',
//         borderBottomColor: 'gray',
//         borderBottomWidth: 1,
//     },
//     NameImg: {
//         width: 50,
//         height: 50,
//         borderRadius: 360,
//         border: '1px solid #fff'
//     },
//     ButtonETC: {
//         width: 120,
//         height: 28,
//         borderRadius: 30,
//         margin: 5,
//         backgroundColor: '#6667ab',
//         justifyContent: 'center',
//         textAlign: 'center',
//         alignSelf: 'center',
//         alignItems: 'center',
//     },
// });

// export default FollowerScreen;