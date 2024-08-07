export interface UserData{
  name: string;
  email : string;
  isActivated: boolean;
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