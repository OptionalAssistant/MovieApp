import express from "express";

import cors from "cors";
import dotenv from 'dotenv';
import { body } from "express-validator";
import multer from 'multer';
import path from "path";
import { MovieController,UserController } from "./controllers";
import sequelize from "./models/db";
import CheckAuth from "./utils/CheckAuth";
import handleValidationErrors from "./utils/handleValidationErrors";
import { loginValidation, registerValidation } from "./validations";
import Movie from './models/Movie';
import Category from "./models/Category";
import CategoryMovie from './models/CategoryMovie';
dotenv.config();



   sequelize.authenticate().then(()=>{
    console.log('Connection has been established successfully.');
   })
   .catch((error)=>{

    console.error('Unable to connect to the database:', error);
   });

   Movie.belongsToMany(Category,{through:CategoryMovie });
   Category.belongsToMany(Movie,{through: CategoryMovie});
   sequelize.sync();
const app = express();
const filePath = path.join(__dirname, "..", "src", "views");


app.set("views", filePath);
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination:(_,__,cb)=>{
      cb(null,'uploads');
  },
  filename:(_,file,cb)=>{
      cb(null,file.originalname);
  },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'));

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
app.get("/auth/me",CheckAuth, UserController.getMe);
app.post("/forgot-password", UserController.forgotPassword);
app.post("/activate",CheckAuth,UserController.activateAccount);
app.get("/activate/:id/:token",UserController.activateLink);
app.get("/reset-password/:id/:token", UserController.resetPassword);
app.get("/movies",MovieController.getMovies);
//app.post("/movies",MovieController.putMovie);
app.get("/movies/pages/:id",MovieController.getMoviePage);
app.get("/movies/number",MovieController.getMoviesNumber);
app.get("/movies/full/:id",MovieController.getFullMovie);
app.get('/movies/video/:id',MovieController.PlayMovie);
app.post(
  "/reset-password/:id/:token",
  body("password", "Пароль должен быть минимум 8 символов").isLength({
    min: 8,
  }),
  handleValidationErrors,
  UserController.updatePassword
);
 app.get("/search",MovieController.SearchMovie);
 app.get("/categories/:idCategory/page/:id",MovieController.getCategory);

app.listen(process.env.PORT);
