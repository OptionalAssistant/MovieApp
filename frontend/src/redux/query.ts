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
  IImageUrl,
  IPerson,
  IFullPerson,
  ISearchPersonResponse,
} from "../types/typesRest";

export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4444/",
    prepareHeaders: (headers) => {
      const token = window.localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }), // Adjust baseUrl if needed
  tagTypes: [
    "Categories",
    "User",
    "Comments",
    "Movies",
    "FullMovie",
    "BestMovies",
    "Disliked",
    "Favourites",
    "Persons",
    "FullPerson"
  ],
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
    fetchMoviePage: builder.query<ISearchMovieResponse, number>({
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
    createMovie: builder.mutation<InterfaceId, FormData>({
      query: (movie) => ({
        url: "movie/create",
        method: "POST",
        body: movie,
      }),
      invalidatesTags: ["Movies"],
    }),
    editMovie: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/movies/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Movies","FullMovie"],
    }),
    fetchPopularMovies: builder.query<ISearchMovieResponse, number>({
      query: (num) => `/movies-popular/${num}`,
      providesTags: ["Movies"],
    }),
    logout: builder.mutation<void, void>({
      query: () => "", // This can be an empty string since no request is made
      invalidatesTags: ["User", "FullMovie"],
    }),
    dislikeMovie: builder.mutation<void, number>({
      query: (num) => ({ url: `/dislike-movie/${num}`, method: "POST" }),
      invalidatesTags: ["FullMovie", "BestMovies", "Disliked","Favourites"],
    }),
    likeMovie: builder.mutation<void, number>({
      query: (num) => ({ url: `/like-movie/${num}`, method: "POST" }), // This can be an empty string since no request is made
      invalidatesTags: ["FullMovie", "BestMovies", "Favourites","Disliked"],
    }),
    fetchFullMovie: builder.query<IFullMovie, number>({
      query: (num) => `/movies/full/${num}`,
      providesTags: ["FullMovie"],
    }),
    fetchBestMovies: builder.query<ISearchMovieResponse, number>({
      query: (num) => `/movies-best/${num}`,
      providesTags: ["FullMovie", "BestMovies"],
    }),
    fetchUserLikedMovies: builder.query<ISearchMovieResponse, number>({
      query: (id) => `/favourites/${id}`,
      providesTags: ["Favourites"],
    }),
    fetchUserDisikedMovies: builder.query<ISearchMovieResponse, number>({
      query: (id) => `/unliked/${id}`,
      providesTags: ["Disliked"],
    }),
    updateAvatar: builder.mutation<void, FormData>({
      query: (data) => ({
        url: "/update-avatar",
        method: "PUT",
        body: data}), // This can be an empty string since no request is made
      invalidatesTags: ["User","Comments"],
    }),
    fetchPersons: builder.query<IPerson[], void>({
      query: () => `/persons`,
      providesTags: ["Persons"],
    }),
    createPerson: builder.mutation<InterfaceId, FormData>({
      query: (person) => ({
        url: "/add/person",
        method: "PUT",
        body: person,
      }),
      invalidatesTags: ["Persons"],
    }),
    editPerson: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/persons/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["FullPerson","Persons"],
    }),
    fetchFullPerson: builder.query<IFullPerson, number>({
      query: (num) => `/persons/full/${num}`,
      providesTags: ["FullPerson"],
    }),
    deletePerson: builder.mutation<void, number>({
      query: (num) => ({
        url: `/persons/delete/${num}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Persons"],
    }),
    deleteAvatar: builder.mutation<void, void>({
      query: () => ({
        url: "/delete-avatar",
        method: "DELETE"}), // This can be an empty string since no request is made
      invalidatesTags: ["User","Comments"],
    }),
    fetchPersonSearchPage: builder.query<ISearchPersonResponse, string>({
      query: (query) => `${query}`,
      providesTags: ["Persons"],
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
  useFetchBestMoviesQuery,
  useFetchUserLikedMoviesQuery,
  useFetchUserDisikedMoviesQuery,
  useUpdateAvatarMutation,
  useFetchPersonsQuery,
  useCreatePersonMutation,
  useEditPersonMutation,
  useFetchFullPersonQuery,
  useDeletePersonMutation,
  useDeleteAvatarMutation,
  useFetchPersonSearchPageQuery,
} = apiService;
