import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIRE_STORE } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
export const saveuser = async (value: any) => {
  try {
    await AsyncStorage.setItem('user', value);
  } catch (e) {
    // saving error
    console.log(e)
  }
};