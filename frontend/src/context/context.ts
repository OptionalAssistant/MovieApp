import {  createContext } from 'react';
import { authAction, State } from '../reducers/auth';
import React from 'react';

interface ContextType{
    state : State;
    dispatch : React.Dispatch<authAction>;
}
const Store = createContext<ContextType>(undefined as unknown as ContextType);

export default Store;