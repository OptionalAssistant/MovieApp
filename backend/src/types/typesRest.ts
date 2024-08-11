import mongoose, { Schema } from "mongoose";

export interface UserData {
  name: string;
  email: string;
  isActivated: boolean;
}
export interface UserDataToken {
  token: string;
  data: UserData;
}

export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IResponceError {
  message: string;
}

export type AuthMeResponce = UserData | IResponceError;

export type LoginResponce = UserDataToken | IResponceError;

export interface IMovie {
  _id : String;
  name: string;
  date: string;
  country : string;
  imageUrl: string;
  categories: mongoose.Types.ObjectId[]  | string[];
}

export interface IFullMovie extends IMovie{
    trailerUrl : string;
    description: string;
}
export interface movieNumber{
  length : number;
}
export type IPutMovieResponce = IMovie | IResponceError;
export type IMovieResponce = IMovie[] | IResponceError;

export interface PageParams {
  id: number;
}


export interface IMovieSearchForm{
    name : string;
    page : number;
}

export interface IMovieNumber{
  total  : number;
}


export interface ISearchMovieResponse {
  movies : IMovie[];
  total : number;
}
export interface ICategory{
  name: string;
  movies : mongoose.Types.ObjectId[];
}
export type SearchMovieResponse = ISearchMovieResponse | IResponceError;
