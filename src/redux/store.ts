import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import FavSumarize from './FavSumarizeSlice'
import ownerSumarize from './ownerSumarizeSlice'
import categoriesTag from './TagCategoriesSlice'
import sumarize from './SumarizeSlice'
import alluser from './AllusersSlice'
import commentSumarizeSlice from './CommentSumarizeSlice'
import FollowSlice from './FollowSlice'
import DetailSlice from './DetailSlice'
// import  viewSlice  from './ViewSlice'
// import  likeSlice  from './LikeSlice'
export const store = configureStore({
  reducer: {
    user: userSlice,
    mycollectionsumarize : FavSumarize,
    ownersumarize: ownerSumarize,
    tagcategories: categoriesTag,
    sumarize: sumarize,
    alluser: alluser,
    commentsumarize: commentSumarizeSlice,
    follow: FollowSlice,
    Detail: DetailSlice,
    // view:viewSlice,
    // like:likeSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch