import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
interface image {
    url:String,
    name:String
}

interface UsersState {
    uid: String,
    displayname: String,
    name: String,
    lastname: String,
    email: String,
    tag:Array<Object>,
    description:String,
    listsumarize:Array<String>,
    imageuser:image
}

const initialState: UsersState = {
    uid: "",
    displayname: "",
    name: "",
    lastname: "",
    email: "",
    tag:[],
    description:'',
    listsumarize:[],
    imageuser:{
        url:'',
        name:''
    }
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        storeuserdata: (state, action) => {
            return action.payload;
        }

    },
})

export const { storeuserdata } = userSlice.actions
export default userSlice.reducer