import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "../../types/typesClient";
import axios from "../../axios";
import {
  ILoginForm,
  IRegisterForm,
  UserData,
  UserDataToken,
} from "../../types/typesRest";

export const fetchUserRegisterData = createAsyncThunk<
  UserDataToken,
  IRegisterForm
>("/auth/register", async (value: IRegisterForm) => {
  const { data } = await axios.post<UserDataToken>(`/auth/register`, value);

  return data;
});

export const fetchAuthMe = createAsyncThunk<UserData>("/auth/me", async () => {
  const { data } = await axios.get<UserData>(`/auth/me`);

  return data;
});

export const fetchLoginMe = createAsyncThunk<UserDataToken, ILoginForm>(
  "/login/me",
  async (value: ILoginForm) => {
    const  data  = await axios.post<UserDataToken>(`/auth/login`, value);
    return data.data;
  }
);
const initialState: IUserState = {
  loading: false,
  error: "",
  user: null,
};

export const authSlicer = createSlice({
  name: "auth",

  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRegisterData.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(fetchUserRegisterData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchUserRegisterData.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.error = "Failed to register";
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.error = "Failed to auth me";
      })
      .addCase(fetchLoginMe.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(fetchLoginMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchLoginMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.error = "Failed to login me";
      });
  },
});
export const { logout } = authSlicer.actions;
export default authSlicer.reducer;
