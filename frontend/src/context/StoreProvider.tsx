import { ReactNode, useReducer } from "react";
import { reducer } from "../reducers/auth";
import Store from "./context";



const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state_, dispatch_] = useReducer(reducer, {
    loading: true,
    error: '',
    user: null,
  });
  
  return (
    <Store.Provider value={{ dispatch: dispatch_, state: state_ }}>
      {children}
    </Store.Provider>
  );
};

export default StoreProvider;
