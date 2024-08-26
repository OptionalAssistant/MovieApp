

export interface UserData{
  name: string;
  email : string;
  isActivated: boolean;
  roles : 'ADMIN' | 'USER';
}
export interface UserDataToken{
  token : string;
  data : UserData;
}

export interface IRegisterForm{
  name :  string;
  email : string;
  password : string;
}

export interface ILoginForm{
  email : string;
  password :string;
}

export interface IMovie {
  id : String;
  name: string;
  country : string;
  date: Date;
  imageUrl: string;
  categories: string[];
}

export interface Date_{
 year: number;
 month: number;
 day : number;
}
export interface IMovieForm {
  id : String;
  name: string;
  date: Date_ ;
  country : string;
  trailerUrl : string;
  imageUrl: string;
  description : string;
  categories: string[];
}
export interface IMovieForm2 {
  id : String;
  name: string;
  date: Date;
  country : string;
  trailerUrl : string;
  imageUrl: string;
  description : string;
  categories: string[];
}
export interface movieNumber{
  length : number;
}

export interface IFullMovie extends IMovie{
  trailerUrl : string;
  description: string;
  commentCount : number;
}

export interface IMovieSearchForm{
  name : string | null;
}

export interface ISearchMovieResponse {
  movies : IMovie[];
  total : number;
}

export interface Category{
  id : number;
  name : string;
}

export interface ICategory{
  name : string;
}

export interface IMovieModel {
  id : String;
  name: string;
  date: string;
  country : string;
  trailerUrl : string;
  imageUrl: string;
  description : string;

}

export interface IMovieComment{
  text : string;
  createdAt: Date;
}
export interface IMovieCommentId{
  id: string | undefined;
  comment: IMovieComment;
}
export interface IUserName{
  name : string;
}

export type MovieComment = IMovieComment & IUserName;