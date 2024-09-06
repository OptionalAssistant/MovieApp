
export interface IUser {
  id : number;
  name: string;
  email: string;
  passwordHash: string;
  isActivated: boolean;
  roles: Role;
  avatar: string;
}


export interface IAuthMe{
  userId : number;
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

export type CombinedType<T> = IAuthMe & T;

export type Role = 'ADMIN' | 'USER'