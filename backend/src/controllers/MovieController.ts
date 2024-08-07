import MovieModel from '../models/Movie'
import { Request, Response, NextFunction } from 'express'
import { IMovie } from '../types/typesClient'

export const getMovies = (req : Request<{},{},IMovie>,res : Response)=>{
    
}