import { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { Op } from "sequelize";
import {
  default as Category,
  default as CategoryModel,
} from "../models/Category";

import MovieModel from "../models/Movie";
import UserModel from "../models/User";
import {
  CombinedType,
  IAuthMe,
  ICategoryName,
  IMovieDelete,
} from "../types/typesClient";
import {
  ICategory,
  IFullMovie,
  IMovie,
  IMovieSearchForm,
  InterfaceId,
  ISearchMovieResponse,
  PageParams,
  SearchMovieResponse
} from "../types/typesRest";
import { processActors, processCategories, processMovies } from "../utils/common";

const movieCount = 12;

export const getMovies = async (req, res: Response<IMovie[]>) => {
  const movies = await MovieModel.findAll();

  const items = await processMovies(movies);
  res.json(items);
};

export const getMoviePage = async (
  req: Request<PageParams>,
  res: Response<ISearchMovieResponse>
) => {
  const { id } = req.params;
  try {
    let index = (id - 1) * movieCount;

    const { rows: movies } = await MovieModel.findAndCountAll({
      offset: index,
      limit: movieCount,
    });
    const items = await processMovies(movies);

    const count = await MovieModel.count();

    res.send({ movies: items, total: count });
  } catch (err) {
    console.log("get movie page error", err);
  }
};

export const getFullMovie = async (
  req: Request<PageParams, {}, IAuthMe>,
  res: Response<IFullMovie>
) => {
  const { id } = req.params;

  try {
    const movie = await MovieModel.findByPk(id, { include: [Category] });
    const items = (await movie.getCategories()).map(
      (category) => category.name
    );

    const dislikeCount = await movie.countDislikedByUsers();
    const likeCount = await movie.countLikedByUsers();
    let isLiked = false;
    let isDisliked = false;

    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await UserModel.findByPk(decoded.id);

        if (!user) {
          console.log("USER NOT FOUND");
          return res.status(404);
        }

        const dislikedMovies = await user.getDislikedMovies();
        const likedMovies = await user.getLikedMovies();

        isLiked = likedMovies.some((item) => item.id === movie.id);
        isDisliked = dislikedMovies.some((item) => item.id === movie.id);
      } catch (error) {
        console.log("ewew", error);
        return res.status(404);
      }
    }

    const directors = (await movie.getDirectors()).map((director) => ({
      name: director.name,
      id: director.id,
    }));

    const actors = (await movie.getActors()).map((director) => ({
      name: director.name,
      id: director.id,
    }));

    const Movie: IFullMovie = {
      id: movie.id,
      name: movie.name,
      trailerUrl: movie.trailerUrl,
      description: movie.description,
      date: movie.date,
      categories: items,
      imageUrl: movie.imageUrl,
      country: movie.country,
      commentCount: movie.commentCount,
      dislikeCount: dislikeCount,
      likeCount: likeCount,
      isDisliked: isDisliked,
      isLiked: isLiked,
      directors: directors,
      actors: actors,
    };

    return res.send(Movie);
  } catch (error) {
    console.log("Error getFullMovie", error);
    return res.status(404);
  }
};

export const SearchMovie = async (
  req: Request<{}, {}, {}, IMovieSearchForm>,
  res: Response<SearchMovieResponse>
) => {
  const s_name = req.query.name;
  const id = req.query.page;

  let index = id ? id - 1 : 0;

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
    const items = await processMovies(moviesSliced);

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

    const items = await processMovies(movies);
    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "oops something went wrong" });
  }
};

export const getAllCategories = async (req, res: Response<Category[]>) => {
  try {
    const categories = await CategoryModel.findAll();

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
  req /* :Request<{}, {}, IMovieForm>*/,
  res: Response<InterfaceId>
) => {
  try {
    console.log("req", req.body);
    const data: Partial<MovieModel> = req.body;
    data.imageUrl = req.file ? req.file.filename : null;

    const movie = await MovieModel.create(data);

    const categories = await processCategories(req.body.categories);

    await movie.setCategories(
      categories.filter((category) => category !== null)
    );

    const actors = await processActors(req.body.actors);
    await movie.setActors(actors.filter((actor) => actor !== null));

    const directors = await processActors(req.body.directors);
    await movie.setDirectors( directors.filter((director) => director !== null));

    return res.send({ id: movie.id });
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(500);
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

export const deleteMovie = async (req: Request<IMovieDelete>, res) => {
  try {
    const movie = await MovieModel.findByPk(req.params.id);

    if (!movie) {
      console.log("Oops smth went wrong..\n");
      return res.send("Error Nt foundfff");
    }

    if (movie.imageUrl) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        movie.imageUrl
      );
      console.log("File path", filePath);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        }
        console.log("All right");
      });
    }
    await movie.destroy();
    return res.send("All right");
  } catch (erorr) {
    console.log("Oops smth went wrong..\n");
    return res.send("Error");
  }
};

export const editMovie = async (
  req /*: Request<IMovieDelete,{},IMovieForm>*/,
  res
) => {
  try {
    const movie = await MovieModel.findByPk(req.params.id);
    console.log("Movvii", req.body);
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        movie.imageUrl
      );
      console.log("Req file", req.file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        }
        console.log("All right");
      });
    }
    movie.name = req.body.name;
    movie.date = req.body.date;
    movie.country = req.body.country;
    movie.trailerUrl = req.body.trailerUrl;
    movie.imageUrl = req.file ? req.file.filename : movie.imageUrl;
    movie.description = req.body.description;

    const categories = await processCategories(req.body.categories);

    await movie.setCategories(categories);

    const actors = await processActors(req.body.actors);
    await movie.setActors(actors);

    const directors = await processActors(req.body.directors);

    await movie.setDirectors(directors);

    await movie.save();

    return res.send({ id: movie.id });
  } catch (error) {
    console.log("Something wennnt wrong!!!", error);
    return res.send({ message: "Error during updating" });
  }
};

export const getNewMovies = async (
  req: Request<PageParams>,
  res: Response<SearchMovieResponse>
) => {
  const { id } = req.params;

  let index = (id - 1) * movieCount;

  try {
    const { rows: movies } = await MovieModel.findAndCountAll({
      order: [["date", "DESC"]],
      offset: index,
      limit: movieCount,
    });
    const items = await processMovies(movies);

    const count = await MovieModel.count();

    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log("Something went wrong during getNewMovies", error);
    res.send({ message: "Error" });
  }
};

export const getPopularMovies = async (
  req: Request<PageParams>,
  res: Response<SearchMovieResponse>
) => {
  const { id } = req.params;
  console.log("id", id);
  let index = (id - 1) * movieCount;

  try {
    const { rows: movies } = await MovieModel.findAndCountAll({
      order: [["commentCount", "DESC"]],
      offset: index,
      limit: movieCount,
    });

    const items = await processMovies(movies);
    const count = await MovieModel.count();

    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log("Something went wrong during getNewMovies", error);
    res.send({ message: "Error" });
  }
};

export const dislikeMovie = async (req: Request<IMovieDelete>, res) => {
  try {
    const movie = await MovieModel.findByPk(req.params.id);

    if (!movie) {
      console.log("Error movie not found in dislike movie");
      return res.status(404);
    }
    const curUser = await UserModel.findByPk(req.body.userId);

    const likedUsers = await movie.getLikedByUsers();
    const dislikedUsers = await movie.getDislikedByUsers();

    let isLiked = likedUsers.some((user) => user.id === req.body.userId);

    if (isLiked) {
      await movie.removeLikedByUser(curUser);
    }

    isLiked = dislikedUsers.some((user) => user.id === req.body.userId);

    if (isLiked) {
      await movie.removeDislikedByUser(curUser);
    } else {
      await movie.addDislikedByUser(curUser);
    }
    (await movie).update({
      likesCount: await (await movie).countLikedByUsers(),
    });
    return res.send({ message: "Success" });
  } catch (error) {
    console.log("Ops something went wrong during dislikeMovie", error);
  }
};

export const likeMovie = async (
  req: Request<IMovieDelete, {}, CombinedType<IAuthMe>>,
  res
) => {
  try {
    const movie = await MovieModel.findByPk(req.params.id);

    if (!movie) {
      console.log("Error movie not found in like movie");
      return res.status(404);
    }
    const curUser = await UserModel.findByPk(req.body.userId);

    const likedUsers = await movie.getLikedByUsers();
    const dislikedUsers = await movie.getDislikedByUsers();

    let isLiked = dislikedUsers.some((user) => user.id === req.body.userId);

    if (isLiked) {
      await movie.removeDislikedByUser(curUser);
    }

    isLiked = likedUsers.some((user) => user.id === req.body.userId);

    if (isLiked) {
      await movie.removeLikedByUser(curUser);
    } else {
      await movie.addLikedByUser(curUser);
    }
    (await movie).update({
      likesCount: await (await movie).countLikedByUsers(),
    });
    return res.send({ message: "Success" });
  } catch (error) {
    console.log("Ops something went wrong during likeMovie", error);
  }
};

export const getBestMovies = async (
  req: Request<PageParams>,
  res: Response<SearchMovieResponse>
) => {
  const { id } = req.params;

  console.log("id", id);
  let index = (id - 1) * movieCount;

  try {
    const { rows: movies } = await MovieModel.findAndCountAll({
      order: [["likesCount", "DESC"]],
      offset: index,
      limit: movieCount,
    });

    const items = await processMovies(movies);

    const count = await MovieModel.count();

    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log("Something went wrong during getNewMovies", error);
    res.send({ message: "Error" });
  }
};

export const getFavourites = async (
  req: Request<{}, {}, IAuthMe>,
  res: Response<SearchMovieResponse>
) => {
  try {
    const user = await UserModel.findByPk(req.body.userId);

    if (!user) {
      console.log("User not found");
      return res.status(404);
    }

    const movies = await user.getLikedMovies();

    const count = movies.length;
    const items = await processMovies(movies);

    res.json({movies : items,total: count});
  } catch (error) {
    console.log("Opps smth went wrong getFavoruiteMovies", error);
    return res.status(404);
  }
};

export const getDisliked = async (
  req: Request<{}, {}, IAuthMe>,
  res: Response<SearchMovieResponse>
) => {
  try {
    const user = await UserModel.findByPk(req.body.userId);

    if (!user) {
      console.log("User not found");
      return res.status(404);
    }

    const movies = await user.getDislikedMovies();

    const items = await processMovies(movies);
    const count = movies.length;

    res.json({ movies: items, total: count });
  } catch (error) {
    console.log("Opps smth went wrong getFavoruiteMovies", error);
    return res.status(404);
  }
};

export const updateAvatar = async (
  req /*: Request<{},{},CombinedType<IImageUrl>>*/,
  res
) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const id = decoded.id;
    console.log("User id", id);
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Avatar url", req.body.avatarUrl);

    if (user.avatar) {
      const filePath = path.join(__dirname, "..", "..", "uploads", user.avatar);
      console.log("File path", filePath);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        }
        console.log("All right");
      });
    }
    console.log("Image url", req.file.filename);

    user.avatar = req.file.filename;

    await user.save();

    return res.send({ message: "Success" });
  } catch (error) {
    console.log("ooops smth went wrong during udationg avatar", error);
    return res.send({ message: "Error" });
  }
};
