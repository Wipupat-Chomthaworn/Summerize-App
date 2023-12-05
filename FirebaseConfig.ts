// Import the functions you need from the SDKs you need
import { initializeApp} from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore'
import { getAuth, initializeAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjhulXZCIwzVpdp_BUIeXwRF0RXThPfVg",
  authDomain: "authentication-axis-3-tool.firebaseapp.com",
  projectId: "authentication-axis-3-tool",
  storageBucket: "authentication-axis-3-tool.appspot.com",
  messagingSenderId: "860549322631",
  appId: "1:860549322631:web:79d736552bfcd29b646522",
  measurementId: "G-VN5WKKQXB3"
};


const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
initializeAuth(app, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage)
});
export const storage = getStorage(app);
export const FIREBASE_AUTH = getAuth(app);
export const FIRE_STORE = getFirestore(app)
// const analytics = getAnalytics(app);

