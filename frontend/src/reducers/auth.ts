import { authAction, State } from "../types/typesClient";


function reducer(state: State, action: authAction): State {

  switch (action.type) {
        case 'pending':
            return {
              ...state,
             loading: true,
             user: null,
              error: "",
            };
      case 'fullfilled':
        return {
          ...state,
          loading: false,
          user: action.payload,
          error: "",
        };
      case 'rejected':
        return {
          ...state,
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

export default reducer;