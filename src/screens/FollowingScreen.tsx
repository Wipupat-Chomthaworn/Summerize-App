import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { FIRE_STORE } from '../../FirebaseConfig';

const FollowingScreen = ({ route, navigation }: any) => {
    const Follow: any = useSelector((state: RootState) => state.follow.find((follow: any) => follow.uid == route.params.uid));
    const alluser = useSelector((state: RootState) => state.alluser);
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [following, setfollowing] = useState<any[]>([]);
    const user = useSelector((state: any) => state.user);
    useEffect(() => {
        console.log("following : " + route.params.uid)
        // const followuser = Follow.find((follow:any) => follow.uid == route.params.uid);
        if (Follow.following) {
            const userfollowing = alluser.filter((user: any) => Follow.following.some((following: any) => following == user.uid));
            setFilteredData(userfollowing);
            setfollowing(userfollowing);
        }
    }, [Follow]);

    const handleSearch = (text: string) => {
        const filteredData = following.filter((item: any) =>
            item.displayname.toLowerCase().includes(text.toLowerCase())
        );

        setSearchText(text);
        setFilteredData(filteredData);
    };

    const UnFollow = async (uid: string) => {
        try {
            const userDocRef = doc(FIRE_STORE, "follow", user.uid);
            const anotherUserDocRef = doc(FIRE_STORE, "follow", uid);

            // Check if the user is already following someone
            if (Follow.following.includes(uid)) {
                // If user is already following, remove user.uid from both arrays
                await updateDoc(userDocRef, {
                    following: arrayRemove(uid),
                });
                await updateDoc(anotherUserDocRef, {
                    follower: arrayRemove(user.uid),
                });
                console.log("Removed from follower", uid);
            }
        } catch (error) {
            console.error("Error updating Firestore documents:", error);
        }
    };

    const followingnavigate = (item: any, user: any) => {
        if (item.uid != user.uid) {
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

                            <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row' }} onPress={() => followingnavigate(item, user)}>
                                <View>
                                    <Image
                                        style={styles.NameImg}
                                        source={item.imageuser && item.imageuser.url ? { uri: item.imageuser.url } : require('../../assets/default-avatar.png')}
                                    />
                                </View>
                                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold", marginLeft: 10 }}>{item.displayname}</Text>
                            </TouchableOpacity>
                            {
                                route.params.uid == user.uid &&
                                    <TouchableOpacity style={styles.ButtonETC} onPress={() => UnFollow(item.uid)}>
                                        <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>เลิกติดตาม</Text>
                                    </TouchableOpacity>
                            }
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
        justifyContent: 'space-between',
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
        height: 45,
        borderRadius: 30,
        margin: 5,
        backgroundColor: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
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
});

export default FollowingScreen;



// ################################################  TypeScript  ##########################################################

// import React, { useState, FC } from 'react';
// import { StyleSheet, View, TextInput, FlatList, Text, Image, Pressable, ImageSourcePropType } from 'react-native';

// interface Item {
//     id: number;
//     img: ImageSourcePropType;
//     name: string;
// }

// const FollowingScreen: FC = () => {
//     const [searchText, setSearchText] = useState<string>('');
//     const [data, setData] = useState<Item[]>([
//         { id: 1, img: require("../assets/favicon.png"), name: 'Item 1' },
//         { id: 2, img: require("../assets/adaptive-icon.png"), name: 'Item 2' },
//         { id: 3, img: require("../assets/icon.png"), name: 'Item 3' },
//         // เพิ่มข้อมูลเพิ่มเติมที่คุณต้องการกรอง
//     ]);
//     const [filteredData, setFilteredData] = useState<Item[]>([]);

//     const handleSearch = (text: string) => {
//         const filteredData = data.filter((item) =>
//             item.name.toLowerCase().includes(text.toLowerCase())
//         );

//         setSearchText(text);
//         setFilteredData(filteredData);
//     };

//     const UnFollow = (itemId: number) => {
//         console.log(itemId);
//     };

//     return (
//         <View style={styles.container}>
//             <View>
//                 <TextInput style={styles.SearchBar}
//                     placeholder="ค้นหา"
//                     onChangeText={handleSearch}
//                     value={searchText}
//                 />
//                 <FlatList
//                     data={filteredData.length > 0 ? filteredData : data}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={({ item }) => (
//                         <View style={styles.NameContainer}>

//                             <View style={{ alignItems: 'center', flexDirection: 'row' }}>
//                                 <View><Image style={styles.NameImg} source={item.img} /></View>
//                                 <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold", marginLeft: 10 }}>{item.name}</Text>
//                             </View>
//                             <Pressable style={styles.ButtonETC} onPress={() => UnFollow(item.id)}>
//                                 <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>เลิกติดตาม</Text>
//                             </Pressable>
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
//         justifyContent: 'space-between',
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

// export default FollowingScreen;