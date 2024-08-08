import MovieModel from "../models/Movie";
import { Request, Response, NextFunction, response } from "express";
import { IMovie, IMovieResponce, IPutMovieResponce, movieNumber, PageParams } from "../types/typesRest";
import MoiveModel from "../models/Movie";

export const getMovies = async (req, res: Response<IMovie[]>) => {
  const movies = await MovieModel.find();
    
  res.json(movies);
};
export const getMoviesNumber = async(req, res: Response<movieNumber>)=>{
    const movies = await MovieModel.find();
    

    res.json({length : movies.length});

};
export const putMovie = async (
  req: Request<{}, {}, IMovie>,
  res: Response<IPutMovieResponce>
) => {
  try {
    const doc = new MoiveModel({
      name: req.body.name,
      country: "USA",
      date: "1828",
    });

    const movie = await doc.save();

    console.log("Movie ", movie);

    res.json(movie);
  } catch (error) {
    console.log(error);
    res.json({ message: "Не удалось добавить фильм" });
  }
};


export const getMoviePage = async(req : Request<PageParams>,res : Response<IMovieResponce>)=>{
        const {id} = req.params;
        console.log("DDD",id);
        try{
            let index = (id - 1) * 9;

            const items = await MovieModel.find().skip(index).limit(9);
            console.log("Items got",items);
            
            res.send(items);
        }
        catch(error){
            res.send({message: "Oops can not get movie page"});
        }


}