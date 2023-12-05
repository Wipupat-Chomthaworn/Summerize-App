import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FIRE_STORE } from '../../FirebaseConfig';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

interface Sumarize {
  _id: string,
  name: string,
  author: string,
  tag: object[],
  view: number,
  file: object,
  img: object,
  // userCollection: object[],
  comment:object[],
  like:String[]
}

const initialState: Sumarize[] = [];

const SumarizeSlice = createSlice({
  name: 'SumarizeSlice',
  initialState,
  reducers: {
    storeSummarizedData: (state, action: PayloadAction<Sumarize[]>) => {
      return action.payload;
    },
    AddSalubLike: (state, action: PayloadAction<{ pdfDetaill: Sumarize, user:any }>) => {
      const { pdfDetaill, user } = action.payload;

      const summerizeDocRef = doc(FIRE_STORE, "Sumarize", pdfDetaill._id);
      updateDoc(summerizeDocRef, {
        like: arrayUnion(user),
      })
        .then(() => {
          console.log("Liked", pdfDetaill._id);
        })
        .catch((error) => {
          console.error("Error adding like:", error);
        });
    },
    CancelLike: (state, action: PayloadAction<{ pdfDetaill: Sumarize, user:any }>) => {
      const { pdfDetaill, user } = action.payload;

      const summerizeDocRef = doc(FIRE_STORE, "Sumarize", pdfDetaill._id);
      updateDoc(summerizeDocRef, {
        like: arrayRemove(user),
      })
        .then(() => {
          console.log("unlike", pdfDetaill._id);
        })
        .catch((error) => {
          console.error("Error adding like:", error);
        });
    },
  },
});

export const { storeSummarizedData, AddSalubLike, CancelLike } = SumarizeSlice.actions;
export default SumarizeSlice.reducer;
