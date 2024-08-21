import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMovieState } from "../../types/typesClient";
import axios from "../../axios";
import { IMovie, ISearchMovieResponse } from "../../types/typesRest";

const initialState: IMovieState = {
  loading: false,
  error: "",
  movies: null,
};


export const fetchMoviePage = createAsyncThunk<IMovie[],number>(
    "/movies/pages/",async (num : number)  => {
      const {data} = await axios.get<IMovie[]>(`/movies/pages/${num}`);
      
      return data;
      
    }
  );

  export const fetchMovieSearchPage = createAsyncThunk<ISearchMovieResponse,string>(
    "/movies/search/pages/",async (query : string,)  => {
      const {data} = await axios.get<ISearchMovieResponse>(query);
      
      return data;
      
    }
  );
  export const fetchMovieCategoryPage = createAsyncThunk<ISearchMovieResponse,string>(
    "/movies/category/pages",async (query : string)  => {
      const {data} = await axios.get<ISearchMovieResponse>(query);
      
      return data;
      
    }
  );

  export const fetchFreshMovies = createAsyncThunk<ISearchMovieResponse,string>(
    "/movies/new",async (query : string)  => {
      const {data} = await axios.get<ISearchMovieResponse>(query);
      
      return data;
      
    }
  );
export const movieSlice = createSlice({
  name: "movie",

  initialState,
  reducers: {
  },
  extraReducers:builder =>{
    builder.addCase(fetchMoviePage.pending,(state)=>{
        state.loading = true;
        state.movies = null;
    })
    .addCase(fetchMoviePage.fulfilled,(state,action)=>{
        state.loading = false;
        state.movies = action.payload; 
    })
    .addCase(fetchMoviePage.rejected,(state)=>{
        state.loading = false;
        state.movies = null;
        state.error= 'Failed to get movie page';
    })
    .addCase(fetchMovieSearchPage.pending,(state)=>{
        state.loading = true;
        state.movies = null;
    })
    .addCase(fetchMovieSearchPage.fulfilled,(state,action)=>{
        state.loading = false;
        state.movies = action.payload.movies; 
    })
    .addCase(fetchMovieSearchPage.rejected,(state)=>{
        state.loading = false;
        state.movies = null;
        state.error= 'Failed to get movie seatrch page';
    })
    .addCase(fetchMovieCategoryPage.pending,(state)=>{
        state.loading = true;
        state.movies = null;
    })
    .addCase(fetchMovieCategoryPage.fulfilled,(state,action)=>{
        state.loading = false;
        state.movies = action.payload.movies; 
    })
    .addCase(fetchMovieCategoryPage.rejected,(state)=>{
        state.loading = false;
        state.movies = null;
        state.error= 'Failed to get movie category page';
    })
    .addCase(fetchFreshMovies.pending,(state)=>{
      state.loading = true;
      state.movies = null;
  })
  .addCase(fetchFreshMovies.fulfilled,(state,action)=>{
      state.loading = false;
      state.movies = action.payload.movies; 
  })
  .addCase(fetchFreshMovies.rejected,(state)=>{
      state.loading = false;
      state.movies = null;
      state.error= 'Failed to get movie category page';
  })
  }
});

export default movieSlice.reducer;
