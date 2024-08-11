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
import { ICategoryName } from "../types/typesClient";
import CategoryModel from "../models/Category";
import Category from "../models/Category";
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
  try {
    let index = (id - 1) * 9;

    const movies = await MovieModel.find().skip(index).limit(9);
    let updatedMovies = [];
    for(let i = 0;i < movies.length; i++){
      const movie = movies[i];
      const items = await Promise.all(
      movie.categories.map(async (categorie) => {
        const category = await CategoryModel.findById(categorie);
        return category.name;
      })
    );
    console.log("Oket");
    const Movie: IFullMovie = {
      _id: movie.id,
      name: movie.name,
      trailerUrl: movie.trailerUrl,
      description: movie.description,
      date: movie.date,
      categories: items,
      imageUrl: movie.imageUrl,
      country: movie.country,
    };
    updatedMovies.push(Movie);
    console.log(updatedMovies);
  }
    res.send(updatedMovies);
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

    const categories = movie.categories;
    console.log("Categories", categories);

    const items = await Promise.all(
      movie.categories.map(async (categorie) => {
        console.log("Category id",categorie);
        const category = await CategoryModel.findById(categorie);
        console.log(category);
        console.log("Category name", categorie.name);
        return category.name;
      })
    );
    console.log("Oket");
    const Movie: IFullMovie = {
      _id: movie.id,
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
    console.log("oops smth went wrong\n", error);
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
    const movie = await MovieModel.find({
      name: { $regex: new RegExp(s_name, "i") },
    });

    const items = movie.slice(index * 9, index * 9 + 9);

    if (!movie.length) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.send({ movies: items, total: movie.length });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Opps something went wrong during request\n" });
  }
};

export const getCategory = async (req: Request<ICategoryName>, res) => {
  const categoryName = req.params.idCategory;

  try {
    const data = await CategoryModel.findOne({ name: categoryName });

    if (!data) {
      return res.send(`No category ${categoryName}`);
    }

    console.log(data);

    const movies = data.movies;

    const items = await Promise.all(
      data.movies.map(async (movieId) => {
        const movie = await MovieModel.findById(movieId);
        return movie;
      })
    );

    console.log("Itemsss", items);
    return res.send(items);
  } catch (error) {
    res.send("oops something went wrong");
  }
};
