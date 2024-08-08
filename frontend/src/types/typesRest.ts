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

export interface IMovie {
  name: string;
  date: string;
  country : string;
}

export interface movieNumber{
  length : number;
}