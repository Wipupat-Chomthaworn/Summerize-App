import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { FIRE_STORE } from '../../FirebaseConfig';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { saveuser } from '../asyncstorage/asyncstorage';
import { useDispatch, useSelector } from 'react-redux';
import { storeuserdata } from '../redux/userSlice';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Button } from '@rneui/themed';

const auth = FIREBASE_AUTH

const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayname, setdisplayname] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [tag, setTag] = useState([]);
  const [alltag, setallTag] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSignUp = async () => {
    // owen write this pls review
    let errorMessage = '';
    const isEmailValid = (email: any) => {
      // owen write this pls review
      // using regex for check is Email Valid
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(email);
    };

    if (!isEmailValid(email)) {
      errorMessage += "Email is Invalid!\n";
    }

    if (password.length < 6) {
      errorMessage += "Password is required at least 6 char.\n";
    }

    if (displayname.length < 1) {
      errorMessage += "Displayname is required.\n";
    }

    if (name.length < 1) {
      errorMessage += "Name is required.\n";
    }

    if (lastname.length < 1) {
      errorMessage += "Last Name is required.\n";
    }
    if(selected.length == 0){
      errorMessage += "tag is required.\n";
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {

      const tagsInAllTag = alltag.filter((allTagItem: any) => {
        return selected.some((tagItem) => tagItem === allTagItem.tagname);
      });
      // firebase function to auth
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: displayname
      })
      // const customDocumentId = res.user.uid; 

      // const usersCollection = collection(FIRE_STORE, 'Users');

      // const userDocRef = doc(usersCollection, customDocumentId);
      // await setDoc(userDocRef, userData);
      const userData = {
        uid: res.user.uid,
        displayname: displayname,
        name: name,
        lastname: lastname,
        email: email,
        imageuser: {},
        tag: tagsInAllTag,
        listsumarize: [],
        imageqr: {}
      };

      const follow = {
        follower: [],
        following: []
      }

      const userDocRef = doc(FIRE_STORE, 'Users', res.user.uid);
      await setDoc(userDocRef, userData);

      const followDocRef = doc(FIRE_STORE, 'follow', res.user.uid);
      await setDoc(followDocRef, follow);
      alert("success");
    } catch (error: any) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

  useEffect(() => {
    async function gettag() {
      const data:any = [];
      const querySnapshot = await getDocs(collection(FIRE_STORE, "Tag"));
      querySnapshot.forEach((doc) => {
        data.push(doc.data())
      });
      const transformedCategories = data.map((category: any, index: number) => ({
        id: index,
        value: category.tagname
      }));
      setTag(transformedCategories);
      setallTag(data);
    }
    gettag();
  }, []);
  //assets/sumarizelogo.png
  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', margin:20 }}>
        <Image source={require("../../assets/sumarizelogo.png")}></Image>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Displayname"
          onChangeText={(text) => setdisplayname(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="LastName"
          onChangeText={(text) => setLastName(text)}
        />
        <View style={{width:'100%'}}>
          <MultipleSelectList
          boxStyles={{ backgroundColor: '#f0f0f0', borderRadius: 0, width: '100%', borderColor:'#ccc' }}
          inputStyles={{ width: '94%', color:'gray' }}
          setSelected={(val: any) => setSelected(val)}
          data={tag}
          save="value"
          label="Categories"
          placeholder='เลือกหมวดหมู่สรุปที่สนใจ '
          badgeStyles={{ backgroundColor: '#6667ab' }}
        />
        </View>
        <View style={{width:'100%'}}>
          <Button buttonStyle={{backgroundColor:'black'}} title="สมัครสมาชิก" onPress={handleSignUp} />
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingLeft: 10,
  },
  inputTag: {
    width: '100%',
  },
});

export default Register;
