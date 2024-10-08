import { Category, IMovie, MovieComment, UserData } from "./typesRest";

export type Role = 'ADMIN' | 'USER'

export interface IUserState {
  loading: boolean;
  error: string;
  user: UserData | null;
}
export interface ICategoryState{
    categories : Category[];
    error : string;
    loading : boolean;
}
export interface ICommentState{
  comments : MovieComment[] | null;
  error: string;
  loading: boolean;
}
export interface authAction {
  type: "pending" | "fullfilled" | "rejected" | "set";
  payload: UserData | null;
}

export interface ServerError{
  data:{
    message: string;
  }
}
export interface IMovieState {
  loading: boolean;
  error: string;
  movies: IMovie[] | null ;
}



export interface movieAction {
  type: "pending" | "fullfilled" | "rejected";
  payload: IMovie[] | null;
}

export interface IMovieList {
  movies: IMovie[];
}


export interface IPaginationList{
  pageCount : number;
  link : string;
  curPage : number;
}
