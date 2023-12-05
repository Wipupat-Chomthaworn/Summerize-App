import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DetailSumarize {
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

const initialState: DetailSumarize[] = [];

const DetailSumarizeSlice = createSlice({
  name: 'DetailSumarizeSlice',
  initialState,
  reducers: {
    storeDetailSumarize: (state, action: PayloadAction<DetailSumarize[]>) => {
      return action.payload;
    },
  },
});

export const { storeDetailSumarize } = DetailSumarizeSlice.actions;
export default DetailSumarizeSlice.reducer;
