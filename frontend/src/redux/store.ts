import { configureStore } from '@reduxjs/toolkit';
import { apiService } from './query'; // Adjust the path to where your apiService is located
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    // Add the API slice reducer
    [apiService.reducerPath]: apiService.reducer,
  },
  // Adding the apiService middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});


export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()