import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoriesTag {
  tagname: string,
  mostsearch: string,
}

const initialState: CategoriesTag[] = [];

const CategoriesTagSlice = createSlice({
  name: 'categoriesTag',
  initialState,
  reducers: {
    storeCategoriesTag: (state, action: PayloadAction<CategoriesTag[]>) => {
      return action.payload;
    },
  },
});

export const { storeCategoriesTag } = CategoriesTagSlice.actions;
export default CategoriesTagSlice.reducer;
