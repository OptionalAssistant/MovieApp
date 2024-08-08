export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  isActivated: boolean;
}


export interface IAuthMe{
  userId : string;
}

export interface ActivateParams {
  id: string;
  token: string;
}