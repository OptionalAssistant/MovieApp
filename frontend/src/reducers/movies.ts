import { loadavg } from "os";
import { IMovieState, movieAction } from "../types/typesClient";
import { error } from "console";

 function reducer(state: IMovieState, action: movieAction) {
  console.log("Action payload", action.payload);

  switch (action.type) {
    case "pending":
      return {
        ...state,
        loading: true,
      };
    case "fullfilled":
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case "rejected":
      return {
        ...state,
        loading: false,
        movies: null,
        error: 'Something went wrong during movies operations'
      };
  }
}

export default reducer;