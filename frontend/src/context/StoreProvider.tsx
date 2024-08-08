import { ReactNode, useReducer } from "react";
import reducerUser from "../reducers/auth";
import IUserStore from "./contextUser";
import reducerMovie from "../reducers/movies";
import IMovieStore from "./contextMovie";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stateUser, dispatchUser] = useReducer(reducerUser, {
    loading: true,
    error: "",
    user: null,
  });
  const [stateMovie, dispatchMovie] = useReducer(reducerMovie, {
    loading: true,
    error: "",
    movies: null,
  });
  return (
    <IUserStore.Provider value={{ dispatch: dispatchUser, state: stateUser }}>
      <IMovieStore.Provider
        value={{ dispatch: dispatchMovie, state: stateMovie }}
      >
        {children}
      </IMovieStore.Provider>
    </IUserStore.Provider>
  );
};
/*
 */
export default StoreProvider;
