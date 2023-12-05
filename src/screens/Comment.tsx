import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FIRE_STORE } from '../../FirebaseConfig';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

const CommentScreen = ({route}:any) => {
    const [comment, setComment] = useState('');
    const user = useSelector((state:RootState) => state.user);
    const comment_insumarize = useSelector((state:RootState) => state.commentsumarize);

    const addComment = async () => {
        try {
            const edituserData = collection(FIRE_STORE, "Comments");
            await addDoc(edituserData, {
                comment:comment,
                date:"",
                // like:[],
                sumarize:route.params.id,
                uid:user.uid
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={{ fontSize: 24, marginBottom: 16 }}>Comment Screen</Text> */}
            <View style={styles.CommentBar}>
                <TextInput style={{ width: 330 }}
                    placeholder="กรอกความคิดเห็น"
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    multiline={true}
                />
                <TouchableOpacity onPress={addComment}>
                    <Entypo name="paper-plane" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsContainer}>
                {comment_insumarize.map((item:any, index) => (
                    <View style={styles.CommentContainer} key={index}>
                        <View><Image source={item.uid.imageuser.url && item.uid.imageuser ? { uri: item.uid.imageuser.url } : require("../../assets/default-avatar.png")} style={styles.NameImg} /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.Name}>{item.uid.displayname}</Text>
                            <Text>{item.comment}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    CommentBar: {
        width: 375,
        minHeight: 45, // กำหนดความสูงขั้นต่ำ
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        alignSelf: 'center',
        display: 'flex',
        padding: 5,
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    commentsContainer: {
        width: 375,
        flex: 1,
        marginBottom: 5,
    },
    CommentContainer: {
        display: 'flex',
        width: 375,
        minHeight: 128, // กำหนดความสูงขั้นต่ำ
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 16,
        padding: 5,
        margin: 2,
        color: 'white',
        borderBottomWidth: 3,
        borderColor: 'black',
        justifyContent: 'space-between',
    },
    NameImg: {
        width: 50,
        height: 50,
        borderRadius: 360,
        marginRight: 10,
    },
    Name: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    
});

export default CommentScreen;