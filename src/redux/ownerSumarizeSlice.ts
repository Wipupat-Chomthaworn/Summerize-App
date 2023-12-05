import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ownerSummary {
  _id: string,
  name: string,
  author: string,
  tag: object[],
  view: number,
  file: object,
  img: '',
  // userCollection: object[],
  comment:object[],
  like:String[]
}

const initialState: ownerSummary[] = [];

const ownerSummarySlice = createSlice({
  name: 'ownerSumarize',
  initialState,
  reducers: {
    storeownerSummary: (state, action: PayloadAction<ownerSummary[]>) => {
      return action.payload;
    },
  },
});

export const { storeownerSummary } = ownerSummarySlice.actions;
export default ownerSummarySlice.reducer;
