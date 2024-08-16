export interface IUser {
  id : number;
  name: string;
  email: string;
  passwordHash: string;
  isActivated: boolean;
  roles: 'ADMIN' | 'USER'
}


export interface IAuthMe{
  userId : string;
}

export interface ActivateParams {
  id: string;
  token: string;
}

export interface ICategoryName{
  idCategory : string;
  id : number;
}

export interface IMovieDelete{
  id : number;
}