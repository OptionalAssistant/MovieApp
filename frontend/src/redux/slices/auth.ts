import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorResponse, IUserState } from "../../types/typesClient";
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
>("/auth/register", async (value: IRegisterForm,{rejectWithValue}) => {

  try{
    const  data  = await axios.post<UserDataToken>(`/auth/register`, value);
    return data.data;
  }
  catch(error){
    const err1 = error as ErrorResponse;
    return rejectWithValue(err1.response.data.message);
  }
}
);

export const fetchAuthMe = createAsyncThunk<UserData>("/auth/me", async () => {
  const { data } = await axios.get<UserData>(`/auth/me`);

  return data;
});

export const fetchLoginMe = createAsyncThunk<UserDataToken, ILoginForm>(
  "/login/me",
  async (value: ILoginForm,{rejectWithValue}) => {
    try{
      const  data  = await axios.post<UserDataToken>(`/auth/login`, value);
      return data.data;
    }
    catch(error){
      const err1 = error as ErrorResponse;
      return rejectWithValue(err1.response.data.message);
    }
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
      .addCase(fetchLoginMe.rejected, (state,action ) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});
export const { logout } = authSlicer.actions;
export default authSlicer.reducer;
