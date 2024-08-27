

export interface UserData {
  name: string;
  email: string;
  isActivated: boolean;
  roles : 'ADMIN' | 'USER';
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
  id : number;
  name: string;
  date: Date;
  country : string;
  imageUrl: string;
  categories: string[];
}
export interface InterfaceId{
  id : number;
}
export interface IFullMovie extends IMovie{
    trailerUrl : string;
    description: string;
    commentCount: number;
    dislikeCount: number;
    likeCount: number;
    isLiked: boolean;
    isDisliked: boolean;
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
  total? : number;
}
export interface ICategory{
  name: string;
}
export type SearchMovieResponse = ISearchMovieResponse | IResponceError;

export interface IMovieForm {
  id : String;
  name: string;
  date: Date;
  country : string;
  trailerUrl : string;
  imageUrl: string;
  description : string;
  categories: string[];
}

export interface IMovieComment{
  text : string;
  createdAt : Date;
  
}

export interface IUserName{
  name : string;

}


export type MovieComment = (IMovieComment & IUserName);

export type MovieCommentResponse = MovieComment[]  | IResponceError;



