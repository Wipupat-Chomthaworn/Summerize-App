import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface UsersState {
    uid: String,
    displayname: String,
    name: String,
    lastname: String,
    email: String,
    tag:Array<Object>,
    description:String,
    listsumarize:Array<String>,
    imageuser:Object
}

const initialState: UsersState[] = []
export const userSlice = createSlice({
    name: 'alluser',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        storealluserdata: (state, action) => {
            return action.payload;
        }

    },
})

export const { storealluserdata } = userSlice.actions
export default userSlice.reducer