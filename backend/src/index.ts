import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import { body } from "express-validator";

import path from "path";
import { MovieController, UserController } from "./controllers";
import Category from "./models/Category";
import CategoryMovie from "./models/CategoryMovie";
import Comment from "./models/Comment";
import sequelize from "./models/db";
import Movie from "./models/Movie";
import MovieDislikes from "./models/MovieDislikes";
import MovieLikes from "./models/MovieLikes";
import User from './models/User';
import CheckAdminAuth from "./utils/CheckAdminAuth";
import CheckAuth from "./utils/CheckAuth";
import handleValidationErrors from "./utils/handleValidationErrors";
import { loginValidation, registerValidation } from "./validations";
import { conditionalImageUpload } from "./utils/MulterMiddleware";

dotenv.config();

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

Movie.belongsToMany(Category, { through: CategoryMovie });
Category.belongsToMany(Movie, { through: CategoryMovie });

Movie.hasMany(Comment);
Comment.belongsTo(Movie);

User.hasMany(Comment);
Comment.belongsTo(User);

// For likes
Movie.belongsToMany(User, {
  through: MovieLikes, // Junction table for likes
  as: 'likedByUsers',
});

User.belongsToMany(Movie, {
  through: MovieLikes,
  as: 'likedMovies',
});

// For dislikes
Movie.belongsToMany(User, {
  through: MovieDislikes, // Junction table for dislikes
  as: 'dislikedByUsers',
});

User.belongsToMany(Movie, {
  through: MovieDislikes,
  as: 'dislikedMovies',
});

const app = express();
const filePath = path.join(__dirname, "..", "src", "views");

app.set("views", filePath);
app.set("view engine", "ejs");

// Multer storage configuration


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", function (request, response) {
  // отправляем ответ
  response.send("<h1>Home</h1>");
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", CheckAuth, UserController.getMe);
app.post("/forgot-password", UserController.forgotPassword);
app.post("/activate", CheckAuth, UserController.activateAccount);
app.get("/activate/:id/:token", UserController.activateLink);
app.get("/reset-password/:id/:token", UserController.resetPassword);
app.get("/movies", MovieController.getMovies);
app.get("/movies/pages/:id", MovieController.getMoviePage);
app.get("/movies/number", MovieController.getMoviesNumber);
app.get("/movies/full/:id", MovieController.getFullMovie);
app.get(`/movies-popular/:id`,MovieController.getPopularMovies);
app.post(
  "/reset-password/:id/:token",
  body("password", "Пароль должен быть минимум 8 символов").isLength({
    min: 8,
  }),
  handleValidationErrors,
  UserController.updatePassword
);
  app.post("/movie/create", CheckAdminAuth,conditionalImageUpload,MovieController.create);
app.post("/dislike-movie/:id",CheckAuth,MovieController.dislikeMovie);
app.post("/like-movie/:id",CheckAuth,MovieController.likeMovie);

app.get("/search", MovieController.SearchMovie);
app.get("/categories/:idCategory/page/:id", MovieController.getCategory);
app.get("/categories/all", MovieController.getAllCategories);
app.post("/add-category", CheckAdminAuth, MovieController.addCategory);
app.post("/add-comment/:id", CheckAuth, MovieController.addComment);
app.get('/get-comments/:id',MovieController.getComments);
app.delete("/remove-category", CheckAdminAuth, MovieController.removeCategory);
app.delete("/movies/delete/:id", CheckAdminAuth, MovieController.deleteMovie);
app.put("/movies/edit/:id", CheckAdminAuth,conditionalImageUpload, MovieController.editMovie);
app.get("/movies-new/:id",MovieController.getNewMovies);
app.get("/movies-best/:id",MovieController.getBestMovies);
app.get("/favourites/:id",CheckAuth,MovieController.getFavourites);
app.put("/update-avatar",CheckAuth,conditionalImageUpload,MovieController.updateAvatar);

app.get("/unliked/:id",CheckAuth,MovieController.getDisliked);

app.listen(process.env.PORT);
