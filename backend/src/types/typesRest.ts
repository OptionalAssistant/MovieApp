

export interface UserData {
  name: string;
  email: string;
  isActivated: boolean;
  roles : 'ADMIN' | 'USER';
  avatar: string;
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
export interface PersonsAct{
  id : number;
  name : string;
}
export interface IFullMovie extends IMovie{
    trailerUrl : string;
    description: string;
    commentCount: number;
    dislikeCount: number;
    likeCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    directors: PersonsAct[];
    actors: PersonsAct[];
}
export interface movieNumber{
  length : number;
}
export type IPutMovieResponce = IMovie | IResponceError;
export type IMovieResponce = IMovie[] | IResponceError;
export type IPersonResponce = IPerson | IResponceError;
export type IFullPersonResponce = IFullPerson | IResponceError;
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



export interface ISearchResponse<T> {
  movies : T[];
  total? : number;
}
export interface ICategory{
  name: string;
}
export interface ISearchPersonResponse {
  people : IPerson[];
  total? : number;
}

export type SearchMovieResponse = ISearchResponse<IMovie> | IResponceError;

export type SearchActorReponse=  ISearchPersonResponse | IResponceError;

export interface IMovieForm {
  id : String;
  name: string;
  date: Date;
  country : string;
  trailerUrl : string;
  description : string;
  categories: string[];
  actors: string[];
  directors: string[];
}

export interface IMovieComment{
  text : string;
  createdAt : Date;
  avatar : string;
}

export interface IUserName{
  name : string;

}

export interface IImageUrl{
  avatarUrl: string;
}

export type MovieComment = (IMovieComment & IUserName);

export type MovieCommentResponse = MovieComment[]  | IResponceError;




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
export interface IFullPerson  extends IPerson{
  actorMovies: IMovie[];
  directorMovies: IMovie[]; 
}