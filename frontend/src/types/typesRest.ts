
import {Role} from './typesClient'


export interface UserData{
  name: string;
  email : string;
  isActivated: boolean;
  roles : Role;
  avatar: string;
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
  description : string;
  categories: string[];
  actors: string[];
  directors: string[];
}
export interface IMovieForm2 {
  id : String;
  name: string;
  date: Date;
  country : string;
  trailerUrl : string;
  description : string;
  categories: string[];
}
export interface movieNumber{
  length : number;
}
export interface InterfaceId{
  id : number;
}
export interface PersonsAct{
  id : number;
  name : string;
}

export interface IFullMovie extends IMovie{
  trailerUrl : string;
  description: string;
  commentCount : number;
  dislikeCount: number;
  likeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  directors: PersonsAct[];
  actors: PersonsAct[];
}

export interface IMovieSearchForm{
  name : string | null;
}

export interface ISearchMovieResponse {
  movies : IMovie[];
  total : number;
}
export interface ISearchPersonResponse {
  people : IPerson[];
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
  createdAt : Date;
  avatar : string;
} 
export interface IMovieCommentId{
  id: string | undefined;
  comment: IMovieComment;
}
export interface IUserName{
  name : string;
}

export interface IImageUrl{
  avatarUrl: string;
}


export type MovieComment = IMovieComment & IUserName;


export interface IPerson{
  id : number;
  date: Date;
  birthplace: string;
  name: string;
  tall: string;
  avatarUrl: string;
}

export interface IFullPerson  extends IPerson{
  actorMovies: IMovie[];
  directorMovies: IMovie[]; 
}
export interface IPersonForm{
  date: Date_ ;
  birthplace: string;
  name: string;
  tall: string;
}

export interface IPersonFull{
  date: Date;
  birthplace: string;
  name: string;
  tall: string;
}

