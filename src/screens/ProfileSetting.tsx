import { StyleSheet, Text, View, Image, TextInput, Button, TouchableWithoutFeedback, ScrollView, TouchableOpacity, Pressable, FlatList, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRE_STORE, storage } from '../../FirebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { storeuserdata } from '../redux/userSlice';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Chip, Icon } from '@rneui/base';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
const CreateSumarize = ({ route }: any) => {
    const [showedit, setshowedit] = useState(true);
    const user = useSelector((state: any) => state.user)
    const [name, onChangeName] = useState(user.name);
    const [lastname, onChangeLastname] = useState(user.lastname);
    const [displayname, onChangeDisplayname] = useState(user.displayname);
    const [description, onChangeDescription] = useState(user.description);

    const [tagcategories, setTagCategories] = useState<object[]>([]);
    const [tag, setTagSelectedupload] = useState<object[]>([]);
    const [image, setImage] = useState("");
    const [showaddnewtag, setshowaddnewtag] = useState(false);
    const [newtag, setnewtag] = useState<any>("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const alltag = useSelector((state: any) => state.tagcategories)
    useEffect(() => {
        const transformedCategories = alltag.map((category: any, index: number) => ({
            id: index,
            value: category.tagname
        }));
        setTagCategories(transformedCategories);
    }, [alltag])

    const handleSaveProfile = () => {
        // นี่คือตำแหน่งที่คุณจะทำการบันทึกข้อมูลโปรไฟล์
    };
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // const imgfileBlob: any = await new Promise((resolve, reject) => {
            //     const xhr = new XMLHttpRequest();
            //     xhr.onload = function () {
            //         resolve(xhr.response);
            //     };
            //     xhr.onerror = function () {
            //         reject(new Error('uriToBlob failed'));
            //     };
            //     xhr.responseType = 'blob';
            //     xhr.open('GET', result.assets[0].uri, true);
            //     xhr.send(null);
            // });
            const response = await fetch(result.assets[0].uri);
            const imgfileBlob = await response.blob();
            console.log(result.assets[0])
            const imageStorageref = ref(storage, '/Userspicture/' + user.uid);
            const picture = {
                contentType: 'image/jpeg',
            };

            const desertRef = ref(storage, `/Userspicture/${user.uid}`);

            if (user.imageuser.url === undefined) {
                await uploadBytes(imageStorageref, imgfileBlob, picture);
                const picturepublish = ref(storage, `/Userspicture/${user.uid}`);

                const imageUrl = await getDownloadURL(picturepublish);
                await updateDoc(doc(FIRE_STORE, "Users", user.uid), {
                    imageuser: {
                        name: user.uid,
                        url: imageUrl
                    }
                });
            }
            else {
                deleteObject(desertRef).then(async () => {
                    await uploadBytes(imageStorageref, imgfileBlob, picture);
                    const picturepublish = ref(storage, `/Userspicture/${user.uid}`);

                    const imageUrl = await getDownloadURL(picturepublish);
                    await updateDoc(doc(FIRE_STORE, "Users", user.uid), {
                        imageuser: {
                            name: user.uid,
                            url: imageUrl
                        }
                    });
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log(error)
                });
            }

        }
    };
    const pickqr = async () => {
        // No permissions request is necessary for launching the image library
        let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const response = await fetch(result.assets[0].uri);
            const imgfileBlob = await response.blob();
            console.log(result.assets[0])
            const imageStorageref = ref(storage, '/Qrpayment/' + user.uid);
            const picture = {
                contentType: 'image/jpeg',
            };

            const desertRef = ref(storage, `/Qrpayment/${user.uid}`);

            if (user.imageqr.url === undefined) {
                await uploadBytes(imageStorageref, imgfileBlob, picture);
                const picturepublish = ref(storage, `/Qrpayment/${user.uid}`);

                const imageUrl = await getDownloadURL(picturepublish);
                await updateDoc(doc(FIRE_STORE, "Users", user.uid), {
                    imageqr: {
                        name: user.uid,
                        url: imageUrl
                    }
                });
            }
            else {
                deleteObject(desertRef).then(async () => {
                    await uploadBytes(imageStorageref, imgfileBlob, picture);
                    const picturepublish = ref(storage, `/Qrpayment/${user.uid}`);

                    const imageUrl = await getDownloadURL(picturepublish);
                    await updateDoc(doc(FIRE_STORE, "Users", user.uid), {
                        imageqr: {
                            name: user.uid,
                            url: imageUrl
                        }
                    });
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log(error)
                });
            }

        }
    };
    const saveuserdata = async () => {
        setIsLoading(true);
        setTagSelectedupload([]);
        setshowedit(true);
        const tagsInAllTag = alltag.filter((allTagItem: any) => {
            return tag.some((tagItem) => tagItem === allTagItem.tagname);
        });


        // console.log("ken" + JSON.stringify(tagsInAllTag[0]));
        if (!tagsInAllTag.length) {
            console.log("null")
            const userEdited = {
                displayname: displayname,
                name: name,
                lastname: lastname,
                email: user.email,
                imageuser: {
                    name: user.imageuser.name || "",
                    url: user.imageuser.url || ""
                },
                follower: [],
                following: [],
                listsumarize: user.listsumarize
            }
            try {
                const edituserData = doc(FIRE_STORE, "Users", user.uid);
                await updateDoc(edituserData, userEdited);
                setIsLoading(false);
                alert("success")
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
            return;
        }
        // console.log(userEdited)
        // dispatch(storeuserdata(userEdited));
        const userEdited = {
            displayname: displayname,
            name: name,
            lastname: lastname,
            email: user.email,
            imageuser: {
                name: user.imageuser.name || "",
                url: user.imageuser.url || ""
            },
            follower: [],
            following: [],
            tag: tagsInAllTag,
            listsumarize: user.listsumarize
        }
        try {
            const edituserData = doc(FIRE_STORE, "Users", user.uid);
            await updateDoc(edituserData, userEdited);
            setIsLoading(false);
            alert("success")
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }
    const addnewtag = async () => {
        const addnewtagref = collection(FIRE_STORE, "Tag");
        await addDoc(addnewtagref, {
            mostsearch: 0,
            tagname: newtag
        });
    }
    return (
        <ScrollView >
            <View style={styles.container}>
                <View style={styles.halfBackground}></View>
                <View>
                    <View style={styles.container}>
                        <Text style={{ marginBottom: 60, marginTop: 30, fontSize: 20, color: 'white', fontWeight: 'bold' }}>Edit Profile</Text>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                style={styles.NameImg}
                                source={user.imageuser && user.imageuser.url ? { uri: user.imageuser.url } : require('../../assets/default-avatar.png')}
                            />
                        </TouchableOpacity>
                        <Text>{user.displayname}</Text>
                        <Text style={{ alignSelf: 'flex-start', marginHorizontal: 20, fontSize: 16, fontWeight: 'bold', marginTop: 30 }}>Displayname</Text>
                        <TextInput
                            placeholder="   displayname"
                            value={displayname}
                            onChangeText={text => onChangeDisplayname(text)}
                            style={styles.input}
                        />
                        <Text style={{ alignSelf: 'flex-start', marginHorizontal: 20, fontSize: 16, fontWeight: 'bold' }}>firstname</Text>
                        <TextInput
                            placeholder="   FirstName"
                            value={name}
                            onChangeText={text => onChangeName(text)}
                            style={styles.input}
                        />
                        <Text style={{ alignSelf: 'flex-start', marginHorizontal: 20, fontSize: 16, fontWeight: 'bold' }}>lastname</Text>
                        <TextInput
                            placeholder="   LastName"
                            value={lastname}
                            onChangeText={text => onChangeLastname(text)}
                            style={styles.input}
                        />
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showaddnewtag}
                            onRequestClose={() => {
                                setshowaddnewtag(!showaddnewtag);
                            }}
                        >
                            <Pressable style={styles.modalContainer} onPress={() => setshowaddnewtag(!showaddnewtag)}>
                                <View style={styles.modalBox}>
                                    <Text style={styles.modalTitle}>กรอกเเท็กที่ต้องการเพิ่ม</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Tag Name"
                                        onChangeText={(text) => setnewtag(text)}
                                    />
                                    <Pressable
                                        style={styles.ButtonETC}
                                        onPress={() => {
                                            // Your logic here
                                            addnewtag();
                                            setshowaddnewtag(!showaddnewtag);
                                        }}
                                    >
                                        <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>เพิ่ม</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </Modal>
                        <Text style={{ alignSelf: 'flex-start', marginHorizontal: 20, fontSize: 16, fontWeight: 'bold' }}>Tag</Text>
                        {user.tag.length != 0 && showedit ?
                            <FlatList
                                style={{ margin: 10 }}
                                data={user.tag}
                                scrollEnabled={false}
                                numColumns={4}
                                keyExtractor={(item: any, index: number) => index.toString()}
                                renderItem={({ item, index }: any) => (
                                    <Chip onPress={() => setshowedit(false)} title={item.tagname} containerStyle={{ marginVertical: 10, marginHorizontal: 5 }} color={"#6667AB"} titleStyle={{ color: 'white' }} />
                                )}
                            /> :
                            <View style={{ width: 375 }}>
                                {user.tag.length == 0 ? null : <TouchableOpacity onPress={() => setshowedit(true)}><Text style={{ textAlign: 'right', color: 'red' }}>cancel</Text></TouchableOpacity>}
                                <MultipleSelectList
                                    setSelected={(val: any) => val ? setTagSelectedupload(val) : setshowaddnewtag(true)}
                                    data={tagcategories}
                                    save="value"
                                    label="Categories"
                                    placeholder='Tag '
                                    badgeStyles={{ backgroundColor: '#6667ab' }}
                                    boxStyles={styles.selectList}
                                />
                            </View>
                        }
                        <TouchableOpacity style={styles.ButtonUpdate} onPress={() => saveuserdata()}>
                            <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>Update</Text>
                        </TouchableOpacity>

                        {user.imageqr.url && user.imageqr ?
                            <Image style={{ width: 230, height: 266 }} source={{ uri: user.imageqr.url }} />
                            : <Image style={{ width: "100%", height: 200 }} source={require('../../assets/qr.png')} />
                        }

                        <Pressable style={styles.ButtonETC} onPress={pickqr}>
                            <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>Change QR Code</Text>
                        </Pressable>

                        <Pressable style={styles.ButtonETC} onPress={() => FIREBASE_AUTH.signOut()}>
                            <Text style={{ color: '#6667ab', justifyContent: 'center', fontWeight: 'bold' }}>Log Out!</Text>
                        </Pressable>
                    </View>
                </View></View>
            <Modal visible={isLoading} transparent={true}>
                <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="black" />
                    <Text>Uploading...</Text>
                </View>
            </Modal>
        </ScrollView>
    )
}

export default CreateSumarize

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 375,
        height: 40,
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
        margin: 15,
    },
    ButtonUpdate: {
        width: 300,
        height: 45,
        borderRadius: 10,
        margin: 20,
        backgroundColor: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    ButtonETC: {
        width: 230,
        height: 45,
        borderRadius: 10,
        margin: 20,
        backgroundColor: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    NameImg: {
        width: 140,
        height: 140,
        borderRadius: 360,
        borderColor: 'white',
        borderWidth: 3,
        backgroundColor: 'white'
    },
    selectList: {
        margin: 10,
        borderWidth: 3,
        borderColor: "gray",
        borderRadius: 10,
    },
    halfBackground: {
        position: 'absolute',
        width: '100%',
        height: 200,
        top: 0, // ตั้งค่า top เพื่อให้ตรงกับครึ่งหนึ่งของ NameImg
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(102, 103, 171, 0.6)"// สีพื้นหลังที่คุณต้องการ
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    modalInput: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        paddingLeft: 10,
    },
    modalBox: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    }
});