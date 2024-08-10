import MovieModel from "../models/Movie";
import { Request, Response, NextFunction, response } from "express";
import {
  IFullMovie,
  IMovie,
  IMovieResponce,
  IMovieSearchForm,
  IPutMovieResponce,
  ISearchMovieResponse,
  movieNumber,
  PageParams,
  SearchMovieResponse,
} from "../types/typesRest";
import MoiveModel from "../models/Movie";
import fs from "fs";

export const getMovies = async (req, res: Response<IMovie[]>) => {
  const movies = await MovieModel.find();

  res.json(movies);
};
export const getMoviesNumber = async (req, res: Response<movieNumber>) => {
  const movies = await MovieModel.find();

  res.json({ length: movies.length });
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

export const getMoviePage = async (
  req: Request<PageParams>,
  res: Response<IMovieResponce>
) => {
  const { id } = req.params;
  console.log("DDD", id);
  try {
    let index = (id - 1) * 9;

    const items = await MovieModel.find().skip(index).limit(9);

    res.send(items);
  } catch (error) {
    res.send({ message: "Oops can not get movie page" });
  }
};

export const getFullMovie = async (
  req: Request<PageParams>,
  res: Response<IFullMovie>
) => {
  const { id } = req.params;

  try {
    const movie = await MovieModel.findById({ _id: id });

    return res.send(movie);
  } catch (error) {
    console.log("oops smth went wrong\n");
    return res.status(404);
  }
};

export const PlayMovie = async (req: Request<PageParams>, res ) => {
  const { id } = req.params;
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }
  console.log("Thats okey");
  // get video stats (about 61MB)
  const videoPath = `D:/anime-project/backend/uploads/${id}.mp4`;
  console.log(videoPath);
  const videoSize = fs.statSync(
    `D:/anime-project/backend/uploads/${id}.mp4`
  ).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
};

export const SearchMovie = async (
  req: Request<{}, {}, {}, IMovieSearchForm>,
  res : Response<SearchMovieResponse>
) => {
  const s_name = req.query.name;
  const id = req.query.page;

  let index = (id - 1);
  console.log("Index ",index);
  try {

    const movie = await MovieModel.find({ name: {$regex: new RegExp(s_name,"i")} });
    
    
    const items = movie.slice(index * 9,index * 9 + 9);
    
    if(!movie.length){

      return res.status(404).json({ message : "Movie not found"});
    }
   return  res.send({movies: items,total : movie.length});
  
  } catch (err) {
    console.log("Catch block");
    return res.status(404).json({message : "Opps something went wrong during request\n"});
  }
};
