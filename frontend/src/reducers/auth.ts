
 export interface State {
  loading: boolean;
  error: string;
  data: any;
} 


export interface authAction {
  type: 'pending' | 'fullfilled' | 'rejected' | 'set';
  payload?: any;
}


 export  function reducer(state: State, action: authAction): State {
  console.log("Action payload",action.payload); 
  switch (action.type) {
        case 'pending':
            return {
             loading: true,
              data: null,
              error: "",
            };
      case 'fullfilled':
        return {
          ...state,
          loading: false,
          data: action.payload,
          error: "",
        };
      case 'rejected':
        return {
          loading: false,
          data: null,
          error: "Something went wrong during fetch",
        };
      case 'set':
        return{
            ...state,
            data: action.payload
        };
      default:
        throw new Error('Unknown action: ' + action.type);
    }
    
  }




