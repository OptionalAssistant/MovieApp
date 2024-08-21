import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { ErrorResponse, ICommentState } from "../../types/typesClient";
import {
    MovieComment
} from "../../types/typesRest";

export const fetchComments = createAsyncThunk<
MovieComment[],string
>("/movie/comments", async (query : string,{rejectWithValue}) => {

  try{
    const  data  = await axios.get<MovieComment[]>(query);
    return data.data;
  }
  catch(error){
    const err1 = error as ErrorResponse;
    return rejectWithValue(err1.response.data.message);
  }
}
);

const initialState: ICommentState = {
    comments:[],
    error:'',
    loading: false
};

export const commentSlicer = createSlice({
  name: "comment",

  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending,(state)=>{
        state.loading = true;
        state.comments = null;
        state.error = '';
    })
    .addCase(fetchComments.fulfilled,(state,action)=>{
        state.loading = false;
        state.comments = action.payload;
        state.error = '';
    })
    .addCase(fetchComments.rejected,(state,action)=>{
        state.error = action.payload as string;
        state.comments  = null;
        state.loading = false;
    })
  },
});
export default commentSlicer.reducer;
