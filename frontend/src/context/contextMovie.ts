import {  createContext } from 'react';
import React from 'react';
import { IMovieState, movieAction } from "../types/typesClient";

interface IMovieContext{
    state : IMovieState;
    dispatch : React.Dispatch<movieAction>;
};

const Store = createContext<IMovieContext>(undefined as unknown as IMovieContext);

export default Store;