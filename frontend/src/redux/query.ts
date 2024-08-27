import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Category,
  UserData,
  UserDataToken,
  ILoginForm,
  IRegisterForm,
  MovieComment,
  IMovie,
  ISearchMovieResponse,
  ICategory,
  IMovieCommentId,
  IMovieModel,
  IMovieForm2,
  InterfaceId,
  IFullMovie,
} from "../types/typesRest";

export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4444/",
    prepareHeaders: (headers) => {
      const token = window.localStorage.getItem("token");
      console.log("TOOOOEK", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }), // Adjust baseUrl if needed
  tagTypes: ["Categories", "User", "Comments", "Movies","FullMovie","BestMovies"],
  endpoints: (builder) => ({
    // Category Endpoints
    fetchCategories: builder.query<Category[], void>({
      query: () => "/categories/all",
      providesTags: ["Categories"],
    }),

    // Authentication Endpoints
    register: builder.mutation<UserDataToken, IRegisterForm>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<UserDataToken, ILoginForm>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    fetchAuthMe: builder.query<UserData, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Movie Endpoints
    fetchMoviePage: builder.query<IMovie[], number>({
      query: (num) => `/movies/pages/${num}`,
      providesTags: ["Movies"],
    }),
    fetchMovieSearchPage: builder.query<ISearchMovieResponse, string>({
      query: (query) => `${query}`,
      providesTags: ["Movies"],
    }),
    fetchMovieCategoryPage: builder.query<ISearchMovieResponse, string>({
      query: (query) => `${query}`,
      providesTags: ["Movies"],
    }),
    fetchFreshMovies: builder.query<ISearchMovieResponse, string>({
      query: (query) => `/movies-new/${query}`,
      providesTags: ["Movies"],
    }),

    // Comment Endpoints
    fetchComments: builder.query<MovieComment[], number>({
      query: (query) => `get-comments/${query}`, // Adjust query string as needed
      providesTags: ["Comments"],
    }),
    deleteCategory: builder.mutation<void, ICategory>({
      query: (body) => ({
        url: "/remove-category",
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["Categories"],
    }),
    addCategory: builder.mutation<void, ICategory>({
      query: (body) => ({
        url: "add-category",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Categories"],
    }),
    addComment: builder.mutation<void, IMovieCommentId>({
      query: (body) => ({
        url: `/add-comment/${body.id}`,
        method: "POST",
        body: body.comment,
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteMovie: builder.mutation<void, number>({
      query: (id) => ({
        url: `/movies/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movies"],
    }),
    createMovie: builder.mutation<InterfaceId, IMovieForm2>({
      query: (movie) => ({
        url: "movie/create",
        method: "POST",
        body: movie,
      }),
      invalidatesTags: ["Movies"],
    }),
    editMovie: builder.mutation<void, IMovieForm2>({
      query: (movie) => ({
        url: `/movies/edit/${movie.id}`,
        method: "PUT",
        body: movie,
      }),
      invalidatesTags: ["Movies"],
    }),
    fetchPopularMovies: builder.query<ISearchMovieResponse, number>({
      query: (num) => `/movies-popular/${num}`,
      providesTags: ["Movies"],
    }),
    logout: builder.mutation<void, void>({
      query: () => "", // This can be an empty string since no request is made
      invalidatesTags: ["User",'FullMovie'],
    }),
    dislikeMovie: builder.mutation<void, number>({
      query: (num)=> ({url:`/dislike-movie/${num}`,method:"POST"}) ,
      invalidatesTags: ["FullMovie","BestMovies"],
    }),
    likeMovie: builder.mutation<void, number>({
      query: (num)=> ({url:`/like-movie/${num}`,method:"POST"})   , // This can be an empty string since no request is made
      invalidatesTags: ["FullMovie","BestMovies"],
    }),
    fetchFullMovie: builder.query<IFullMovie, number>({
      query: (num) => `/movies/full/${num}`,
      providesTags: ['FullMovie'], 
    }),
    fetchBestMovies: builder.query<ISearchMovieResponse, number>({
      query: (num) => `/movies-best/${num}`,
      providesTags: ['FullMovie',"BestMovies"], 
    }),
    
  }),
});

export const {
  useFetchCategoriesQuery,
  useRegisterMutation,
  useLoginMutation,
  useFetchAuthMeQuery,
  useFetchMoviePageQuery,
  useFetchMovieSearchPageQuery,
  useFetchMovieCategoryPageQuery,
  useFetchFreshMoviesQuery,
  useFetchCommentsQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
  useAddCommentMutation,
  useDeleteMovieMutation,
  useCreateMovieMutation,
  useEditMovieMutation,
  useFetchPopularMoviesQuery,
  useLogoutMutation,
  useLikeMovieMutation,
  useDislikeMovieMutation,
  useFetchFullMovieQuery,
  useFetchBestMoviesQuery
} = apiService;
