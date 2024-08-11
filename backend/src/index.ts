import express from "express";

import mongoose from "mongoose";
import cors from "cors";
import { registerValidation, loginValidation } from "./validations";
import handleValidationErrors from "./utils/handleValidationErrors";
import { UserController,MovieController } from "./controllers";
import path from "path";
import { body } from "express-validator";
import CheckAuth from "./utils/CheckAuth";
import dotenv from 'dotenv';
import multer from 'multer';
import { PlayMovie } from "./controllers/MovieController";

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB ok");
  })
  .catch(() => {
    console.log("DB error");
  });
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
app.post("/movies",MovieController.putMovie);
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
app.get("/categories/:idCategory",MovieController.getCategory);

app.listen(process.env.PORT);
