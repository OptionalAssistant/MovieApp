import { UserData } from "./typesRest";

export interface State {
    loading: boolean;
    error: string;
    user: UserData | null;
  }
  
  
  export interface authAction {
    type: 'pending' | 'fullfilled' | 'rejected' | 'set';
    payload: UserData | null;
  }