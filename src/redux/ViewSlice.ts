import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface ViewState {
    listuser: Array<String>,
}

const initialState: ViewState = {
    listuser: [],
}

export const viewSlice = createSlice({
    name: 'view',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        storeviewdata: (state, action) => {
            return action.payload;
        }

    },
})

export const { storeviewdata } = viewSlice.actions
export default viewSlice.reducer