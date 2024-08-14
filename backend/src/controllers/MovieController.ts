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
import fs from "fs";
import { ICategoryName } from "../types/typesClient";
import CategoryModel from "../models/Category";
import MovieModel from "../models/Movie";
import Category from "../models/Category";
import { Op } from "sequelize";
const movieCount = 1;
export const getMovies = async (req, res: Response<IMovie[]>) => {
  const movies = await MovieModel.findAll();
  console.log("Movies");
  let items : IMovie[];
    for(let i = 0;i < movies.length;i++){
      const curMovie = movies[i];
      const curCategories = (await curMovie.getCategories()).map(category => category.name); 
      items.push({id: curMovie.id,name:curMovie.name,date: curMovie.date,country:curMovie.country,
        imageUrl: curMovie.imageUrl,categories:curCategories}
      );
    }
  res.json(items);
};
export const getMoviesNumber = async (req, res: Response<movieNumber>) => {
  const movies = await MovieModel.findAll();

  res.json({ length: movies.length });
};

export const getMoviePage = async (
  req: Request<PageParams>,
  res: Response<IMovieResponce>
) => {
  const { id } = req.params;
  try {
    let index = (id - 1) * movieCount;

    const { rows: movies } = await MovieModel.findAndCountAll({
      offset: index,
      limit: movieCount,
    });
    let items: IMovie[] = []; 
    for(let i = 0;i < movies.length;i++){
      const curMovie = movies[i];
      const curCategories = (await curMovie.getCategories()).map(category => category.name); 
      items.push({id: curMovie.id,name:curMovie.name,date: curMovie.date,country:curMovie.country,
        imageUrl: curMovie.imageUrl,categories:curCategories}
      );
    }

    res.send(items);
  } catch (err) {
    console.log("get movie page error",err);
  }
};

export const getFullMovie = async (
  req: Request<PageParams>,
  res: Response<IFullMovie>
) => {
  const { id } = req.params;

  try {
    const movie = await MovieModel.findByPk(id, { include: Category });

    const items = (await movie.getCategories()).map(category=>category.name);

    const Movie: IFullMovie = {
      id: movie.id,
      name: movie.name,
      trailerUrl: movie.trailerUrl,
      description: movie.description,
      date: movie.date,
      categories: items,
      imageUrl: movie.imageUrl,
      country: movie.country,
    };
    return res.send(Movie);
  } catch (error) {
    return res.status(404);
  }
};

export const PlayMovie = async (req: Request<PageParams>, res) => {
  const { id } = req.params;
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = `D:/anime-project/backend/uploads/${id}.mp4`;

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
  res: Response<SearchMovieResponse>
) => {
  const s_name = req.query.name;
  const id = req.query.page;

  let index = id - 1;

  try {
    const { count, rows: movies } = await MovieModel.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${s_name}%`, // Case-insensitive search
        },
      },
      offset: index, // Pagination offset
      limit: movieCount,  // Number of records per page
    });

    if (!movies.length) {
      return res.status(404).json({ message: "Movie not found" });
    }
    let items: IMovie[] = []; 
    for(let i = 0;i < movies.length;i++){
      const curMovie = movies[i];
      const curCategories = (await curMovie.getCategories()).map(category => category.name); 
      items.push({id: curMovie.id,name:curMovie.name,date: curMovie.date,country:curMovie.country,
        imageUrl: curMovie.imageUrl,categories:curCategories}
      );
    }
    return res.send({ movies: items, total: movies.length });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Opps something went wrong during request\n" });
  }
};

export const getCategory = async (
  req: Request<ICategoryName>,
  res: Response<SearchMovieResponse>
) => {
  const categoryName = req.params.idCategory;
  const id = req.params.id;
  let index = id - 1;
  try {
    const data = await CategoryModel.findOne({ where: { name: categoryName } });
    if (!data) {
      return res.send({ message: `No category ${categoryName}` });
    }
    console.log("Okey",categoryName);
    let movies = (await data.getMovies());
    const count = movies.length;

    movies = movies.slice(index * movieCount,index * movieCount +movieCount);
    let items: IMovie[] = []; 
    for(let i = 0;i < movies.length;i++){
      const curMovie = movies[i];
      const curCategories = (await curMovie.getCategories()).map(category => category.name); 
      items.push({id: curMovie.id,name:curMovie.name,date: curMovie.date,country:curMovie.country,
        imageUrl: curMovie.imageUrl,categories:curCategories}
      );
    }
    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log('error',error);
    res.send({ message: "oops something went wrong" });
  }
};
