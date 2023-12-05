import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, storage } from '../../FirebaseConfig';
import Authentication from './Authentication';
import MainScreen from './MainNavigator';
import { FIRE_STORE } from '../../FirebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { storeuserdata } from '../redux/userSlice';
import axios, { Axios } from 'axios';
import { storeFavSumarize } from '../redux/FavSumarizeSlice';
import { storeownerSummary } from '../redux/ownerSumarizeSlice';
import { storeCategoriesTag } from '../redux/TagCategoriesSlice';
import { Firestore, QuerySnapshot, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { storeSummarizedData } from '../redux/SumarizeSlice';
import { storealluserdata } from '../redux/AllusersSlice';
import { storefollowdata } from '../redux/FollowSlice';

const Stack = createNativeStackNavigator();

export default function FirstNavigator() {
    const [user, setUserToken] = useState<User | null>(null)
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user: any) => {
            try {
                setUserToken(user)
                const userdocumentRef = doc(FIRE_STORE, "Users", user.uid);
                const collectionRef = collection(FIRE_STORE, "Sumarize");
                const tagRef = collection(FIRE_STORE, "Tag");
                // const followRef = doc(FIRE_STORE, "follow", user.uid);
                const followRef = collection(FIRE_STORE, "follow");
                const likeRef = collection(FIRE_STORE, "like");


                const userSub = onSnapshot(userdocumentRef, (doc) => {
                    console.log("hello")
                    dispatch(storeuserdata(doc.data()));
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                });

                const alluserSub = onSnapshot(collection(FIRE_STORE, "Users"), (querySnapshot) => {
                    const alluser: any = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
                    dispatch(storealluserdata(alluser));
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                });

                const allsumarizeSub = onSnapshot(collectionRef, (querySnapshot) => {
                    const dataArray: any = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
                    dispatch(storeSummarizedData(dataArray));
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                });

                const CollectionmycreateQuery = query(collectionRef, where("author", "==", user.uid));
                const ownersumarizeSub = onSnapshot(CollectionmycreateQuery, (querySnapshot) => {
                    const dataArray: any = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
                    dispatch(storeownerSummary(dataArray));
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                });


                const tagsub = onSnapshot(tagRef, (querySnapshot) => {
                    const dataArray: any = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
                    dispatch(storeCategoriesTag(dataArray));
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                });

                const follow = onSnapshot(followRef, (querySnapshot) => {
                    const dataArray: any = querySnapshot.docs.map((doc) => ({uid: doc.id, ...doc.data() }));
                    dispatch(storefollowdata(dataArray));
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                });
                
                return () => {
                    if (alluserSub) {
                        alluserSub();
                    }
                    if (allsumarizeSub) {
                        allsumarizeSub();
                    }
                    if (ownersumarizeSub) {
                        ownersumarizeSub();
                    }
                    if (tagsub) {
                        tagsub();
                    }
                    if (userSub) {
                        userSub();
                    }
                    if (follow){
                        follow();
                    }
                };
            } catch (e) {
                console.log("jello")
            }

        })
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator>

                {user ? (<Stack.Screen
                    name="MainScreen"
                    component={MainScreen}
                    options={{
                        headerShown: false,
                    }}
                />) : (<Stack.Screen
                    name="Authentication"
                    component={Authentication}
                    options={{
                        headerShown: false,
                    }}
                />)}
            </Stack.Navigator>
        </NavigationContainer>

    );
}