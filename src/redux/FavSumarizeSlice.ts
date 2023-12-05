import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavSumarize {
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

const initialState: FavSumarize[] = [];

const FavSumarizeSlice = createSlice({
  name: 'FavSumarizeSlice',
  initialState,
  reducers: {
    storeFavSumarize: (state, action: PayloadAction<FavSumarize[]>) => {
      return action.payload;
    },
  },
});

export const { storeFavSumarize } = FavSumarizeSlice.actions;
export default FavSumarizeSlice.reducer;
