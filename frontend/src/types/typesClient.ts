import { IMovie, UserData } from "./typesRest";


export interface IUserState {
  loading: boolean;
  error: string;
  user: UserData | null;
}

export interface authAction {
  type: "pending" | "fullfilled" | "rejected" | "set";
  payload: UserData | null;
}

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
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

export interface PageParams {
  items: any[];
}


export interface IPaginationList{
  pageCount : number;
  link : string;
  curPage : number;
}
