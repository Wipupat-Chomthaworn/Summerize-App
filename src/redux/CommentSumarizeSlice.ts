import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface Commentsumarize {
    comment: String,
    date: String,
    sumarize: String,
    lastname: String,
    uid: String
}

const initialState: Commentsumarize[] = []


export const CommentsumarizeSlice = createSlice({
    name: 'Comment',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        storecommentsumarize: (state, action: PayloadAction<Commentsumarize[]>) => {
            return action.payload;
        }
    },
})

export const { storecommentsumarize } = CommentsumarizeSlice.actions
export default CommentsumarizeSlice.reducer