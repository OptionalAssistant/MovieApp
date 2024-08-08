import {  createContext } from 'react';
import React from 'react';
import { authAction,  State } from '../types/typesClient';

interface ContextType{
    state : State;
    dispatch : React.Dispatch<authAction>;
}


const Store = createContext<ContextType>(undefined as unknown as ContextType);

export default Store;