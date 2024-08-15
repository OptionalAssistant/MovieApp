import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import moviesReducer from './slices/movie';

export const store = configureStore({
  reducer: {
    auth :authReducer ,
    movies : moviesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()