import { Request, Response, NextFunction, response } from "express";
import {
  ICategory,
  IFullMovie,
  IMovie,
  IMovieForm,
  IMovieResponce,
  IMovieSearchForm,
  IPutMovieResponce,
  ISearchMovieResponse,
  movieNumber,
  PageParams,
  SearchMovieResponse,
} from "../types/typesRest";
import fs from "fs";
import { ICategoryName, IMovieDelete } from "../types/typesClient";
import CategoryModel from "../models/Category";
import MovieModel from "../models/Movie";
import Category from "../models/Category";
import { Op } from "sequelize";
import { error, trace } from "console";
const movieCount = 1;
export const getMovies = async (req, res: Response<IMovie[]>) => {
  const movies = await MovieModel.findAll();

  let items: IMovie[];
  for (let i = 0; i < movies.length; i++) {
    const curMovie = movies[i];
    const curCategories = (await curMovie.getCategories()).map(
      (category) => category.name
    );
    items.push({
      id: curMovie.id,
      name: curMovie.name,
      date: curMovie.date,
      country: curMovie.country,
      imageUrl: curMovie.imageUrl,
      categories: curCategories,
    });
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
    for (let i = 0; i < movies.length; i++) {
      const curMovie = movies[i];
      const curCategories = (await curMovie.getCategories()).map(
        (category) => category.name
      );
      items.push({
        id: curMovie.id,
        name: curMovie.name,
        date: curMovie.date,
        country: curMovie.country,
        imageUrl: curMovie.imageUrl,
        categories: curCategories,
      });
    }

    res.send(items);
  } catch (err) {
    console.log("get movie page error", err);
  }
};

export const getFullMovie = async (
  req: Request<PageParams>,
  res: Response<IFullMovie>
) => {
  const { id } = req.params;

  try {
    const movie = await MovieModel.findByPk(id, { include: Category });

    const items = (await movie.getCategories()).map(
      (category) => category.name
    );

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

export const SearchMovie = async (
  req: Request<{}, {}, {}, IMovieSearchForm>,
  res: Response<SearchMovieResponse>
) => {
  const s_name = req.query.name;
  const id = req.query.page;

  let index = id - 1;

  try {
    const movies = await MovieModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${s_name}%`, // Case-insensitive search
        },
      },
      // offset: index, // Pagination offset
      // limit: movieCount,  // Number of records per page
    });
    const count = movies.length;
    const moviesSliced = movies.slice(
      index * movieCount,
      index * movieCount + movieCount
    );
    if (!movies.length) {
      return res.status(404).json({ message: "Movie not found" });
    }
    let items: IMovie[] = [];
    for (let i = 0; i < moviesSliced.length; i++) {
      const curMovie = moviesSliced[i];
      const curCategories = (await curMovie.getCategories()).map(
        (category) => category.name
      );
      items.push({
        id: curMovie.id,
        name: curMovie.name,
        date: curMovie.date,
        country: curMovie.country,
        imageUrl: curMovie.imageUrl,
        categories: curCategories,
      });
    }
    return res.send({ movies: items, total: count });
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

    let movies = await data.getMovies();
    const count = movies.length;

    movies = movies.slice(index * movieCount, index * movieCount + movieCount);
    let items: IMovie[] = [];
    for (let i = 0; i < movies.length; i++) {
      const curMovie = movies[i];
      const curCategories = (await curMovie.getCategories()).map(
        (category) => category.name
      );
      items.push({
        id: curMovie.id,
        name: curMovie.name,
        date: curMovie.date,
        country: curMovie.country,
        imageUrl: curMovie.imageUrl,
        categories: curCategories,
      });
    }
    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "oops something went wrong" });
  }
};

export const getAllCategories = async (req, res: Response<Category[]>) => {
  try {
    const categories = await CategoryModel.findAll();
    categories.forEach((category) => console.log("Category", category.name));

    res.send(categories);
  } catch (error) {
    console.log("Ooops something went wrong during getAllCategories", error);
  }
};

export const addCategory = async (req: Request<{}, {}, ICategory>, res) => {
  try {
    const data = await CategoryModel.create({ name: req.body.name });

    console.log("Category with name added", data.name);
    res.send({ message: "Well" });
  } catch (error) {
    console.log("Ooops smth went wrong during add category", error);
    res.send({ message: "Error" });
  }
};

export const create = async (
  req: Request<{}, {}, IMovieForm>,
  res: Response<MovieModel>
) => {
  try {
    const movie = await MovieModel.create({
      name: req.body.name,
      date: req.body.date,
      country: req.body.country,
      trailerUrl: req.body.trailerUrl,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    });

    const categories = await Promise.all(
      req.body.categories.map(async (name) => {
        const category = await Category.findOne({ where: { name } });
        return category;
      })
    );
    await movie.setCategories(categories);

    return res.send(movie);
  } catch (erorr) {
    //   return res.send({message: "Movie was not added.Error"});
  }
};

export const removeCategory = async (req: Request<{}, {}, ICategory>, res) => {
  try {
    console.log("Delete category", req.body.name);
    const categoryInstance = await CategoryModel.findOne({
      where: { name: req.body.name },
    });

    if (!categoryInstance) {
      return res.send("Category not found");
    }
    await categoryInstance.destroy();

    return res.send("Category was deleted");
  } catch (error) {
    console.log("Failed to delete category", error);
    return res.send("Category deleted");
  }
};

export const deleteMovie = async(req: Request<IMovieDelete>, res) => {
  try {
    const movie = await MovieModel.findByPk(req.params.id);

    if (!movie) {
      console.log("Oops smth went wrong..\n");
    return  res.send("Error Nt foundfff");
    }

    await movie.destroy();
    return res.send("All right");

  } catch (erorr) {
    console.log("Oops smth went wrong..\n");
    return res.send("Error");
  }
};

export const editMovie = async(req : Request<IMovieDelete,{},IMovieForm>,res)=>{
 
 try{
  const movie = await MovieModel.findByPk(req.params.id);

  movie.name = req.body.name;
  movie.date = req.body.date;
  movie.country = req.body.country;
  movie.trailerUrl =  req.body.trailerUrl;
  movie.imageUrl = req.body.imageUrl;
  movie.description = req.body.description;
  
  const categories = await Promise.all(
    req.body.categories.map(async (name) => {
      const category = await Category.findOne({ where: { name } });
      return category;
    })
  );
  await movie.setCategories(categories);

  await movie.save();

  console.log("Movie updated");
  return res.send({message :"Movie updated"});
 }
catch(error){
  console.log("Something wennnt wrong");
  return res.send({message :"Error during updating"});
}
}
