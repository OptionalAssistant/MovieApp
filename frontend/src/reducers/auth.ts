import { authAction, State } from "../types/typesClient";


 export  function reducer(state: State, action: authAction): State {
  console.log("Action payload",action.payload); 
  switch (action.type) {
        case 'pending':
            return {
             loading: true,
             user: null,
              error: "",
            };
      case 'fullfilled':
        return {
          loading: false,
          user: action.payload,
          error: "",
        };
      case 'rejected':
        return {
          loading: false,
          user: null,
          error: "Something went wrong during fetch",
        };
      case 'set':
        return{
            ...state,
            user: action.payload
        };
      default:
        throw new Error('Unknown action: ' + action.type);
    }
    
  }




