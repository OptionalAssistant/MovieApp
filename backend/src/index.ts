import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import { body } from "express-validator";

import path from "path";
import { CommentController, MovieController, PersonController, UserController } from "./controllers";
import sequelize from "./models/db";
import CheckAdminAuth from "./utils/CheckAdminAuth";
import CheckAuth from "./utils/CheckAuth";
import handleValidationErrors from "./utils/handleValidationErrors";
import { conditionalImageUpload } from "./utils/MulterMiddleware";
import { loginValidation, registerValidation } from "./validations";
import Category from './models/Category';
import Movie from './models/Movie';
import CategoryMovie from './models/CategoryMovie';
import User from './models/User';
import MovieLikes from './models/MovieLikes';
import Comment
 from './models/Comment';
import MovieDislikes from './models/MovieDislikes';
import Person from './models/Person';
import DirectorMovie from './models/DirectorMovie';
import ActorMovie from './models/ActorMovie';

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
  
  
  Movie.belongsToMany(Person, { through: DirectorMovie, as: 'directors' });
  Person.belongsToMany(Movie, { through: DirectorMovie, as: 'directedMovies' });
  
  // Movie - Actor Association
  Movie.belongsToMany(Person, { through: ActorMovie, as: 'actors' });
  Person.belongsToMany(Movie, { through: ActorMovie, as: 'actedMovies' });
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

app.get("/search/main", MovieController.SearchMovie);
app.get("/search/actor", PersonController.Search);

app.get("/categories/:idCategory/page/:id", MovieController.getCategory);
app.get("/categories/all", MovieController.getAllCategories);
app.post("/add-category", CheckAdminAuth, MovieController.addCategory);
app.post("/add-comment/:id", CheckAuth, CommentController.addComment);
app.get('/get-comments/:id',CommentController.getComments);
app.delete("/remove-category", CheckAdminAuth, MovieController.removeCategory);
app.delete("/movies/delete/:id", CheckAdminAuth, MovieController.deleteMovie);
app.delete("/persons/delete/:id",CheckAdminAuth,PersonController.deletePerson);
app.delete('/delete-avatar',CheckAuth,UserController.deleteAvatar)

app.put("/movies/edit/:id", CheckAdminAuth,conditionalImageUpload, MovieController.editMovie);
app.get("/movies-new/:id",MovieController.getNewMovies);
app.get("/movies-best/:id",MovieController.getBestMovies);
app.get("/favourites/:id",CheckAuth,MovieController.getFavourites);
app.put("/update-avatar",CheckAuth,conditionalImageUpload,MovieController.updateAvatar);
app.get("/unliked/:id",CheckAuth,MovieController.getDisliked);
app.get("/persons/:id",PersonController.getPersons);
app.put("/add/person",CheckAdminAuth,conditionalImageUpload,PersonController.addPerson);
app.get(`/person/:id`,PersonController.getPerson);
app.get(`/persons/full/:id`,PersonController.getFullPerson);
app.put("/persons/edit/:id",CheckAdminAuth,conditionalImageUpload,PersonController.editPerson);
app.listen(process.env.PORT);
