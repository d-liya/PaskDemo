import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import modalSlice from "./modalSlice";
import notificationSlice from "./notificationSlice";
import todoSlice from "./todoSlice";
export const store = configureStore({
  reducer: {
    todo: todoSlice,
    notification: notificationSlice,
    auth: authSlice,
    modal: modalSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
