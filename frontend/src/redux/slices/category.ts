import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { ErrorResponse, ICategoryState } from "../../types/typesClient";
import {
    Category
} from "../../types/typesRest";

export const fetchCategories = createAsyncThunk<
  Category[]
>("/categories/all", async (_,{rejectWithValue}) => {

  try{
    const  data  = await axios.get<Category[]>(`/categories/all`);
    return data.data;
  }
  catch(error){
    const err1 = error as ErrorResponse;
    return rejectWithValue(err1.response.data.message);
  }
}
);

const initialState: ICategoryState = {
  categories:[],
  loading: false,
  error:''
  
};

export const categorySlicer = createSlice({
  name: "category",

  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending,(state)=>{
        state.loading = true;
        state.categories = [];
        state.error = '';
    })
    .addCase(fetchCategories.fulfilled,(state,action)=>{
        state.loading = false;
        state.categories = action.payload;
    })
    .addCase(fetchCategories.rejected,(state,action)=>{
        state.error = action.payload as string;
        state.categories  = [];
        state.loading = false;
    })
  },
});
export default categorySlicer.reducer;
