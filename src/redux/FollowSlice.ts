import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface FollowState {
    uid: String,
    follower: String[],
    following: String[]
}

const initialState: FollowState[] = []

export const followSlice = createSlice({
    name: 'follow',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        storefollowdata: (state, action) => {
            return action.payload;
        }

    },
})

export const { storefollowdata } = followSlice.actions
export default followSlice.reducer