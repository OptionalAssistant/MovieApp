import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import { MovieController, UserController } from "./controllers";
import sequelize from "./models/db";
import CheckAuth from "./utils/CheckAuth";
import handleValidationErrors from "./utils/handleValidationErrors";
import { loginValidation, registerValidation } from "./validations";
import Movie from "./models/Movie";
import Category from "./models/Category";
import CategoryMovie from "./models/CategoryMovie";
import fs from "fs";
import CheckAdminAuth from "./utils/CheckAdminAuth";
import Comment from "./models/Comment";
import User from './models/User';

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

sequelize.sync({ alter: true }) // Safely add new fields without dropping the table.
    .then(() => {
        console.log('Database & tables updated!');
    })
    .catch(err => {
        console.error('Error updating tables:', err);
    });
const app = express();
const filePath = path.join(__dirname, "..", "src", "views");

app.set("views", filePath);
app.set("view engine", "ejs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const date = new Date();
    const formattedDate = date
      .toISOString()
      .replace(/[:T]/g, "-")
      .split(".")[0]; // Format date as YYYY-MM-DD-HH-MM-SS
    const ext = path.extname(file.originalname);

    const newFilename = `${formattedDate}${ext}`;
    cb(null, newFilename); // Pass the new filename
  },
});

const upload = multer({ storage });

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
app.post("/movie/create", CheckAdminAuth, MovieController.create);
app.get("/search", MovieController.SearchMovie);
app.get("/categories/:idCategory/page/:id", MovieController.getCategory);
app.get("/categories/all", MovieController.getAllCategories);
app.post("/add-category", CheckAdminAuth, MovieController.addCategory);
app.post("/add-comment/:id", CheckAuth, MovieController.addComment);
app.get('/get-comments/:id',MovieController.getComments);
app.delete("/remove-category", CheckAdminAuth, MovieController.removeCategory);
app.delete("/movies/delete/:id", CheckAdminAuth, MovieController.deleteMovie);
app.put("/movies/edit/:id", CheckAdminAuth, MovieController.editMovie);
app.get("/movies-new/:id",MovieController.getNewMovies);

app.delete("/image/delete/:path", async (req, res) => {
  const fileName = req.params.path;
  const filePath = path.join(__dirname, "..", "uploads", fileName);
  console.log("Path", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting the file:", err);
      return res.status(500).send("Error deleting the file");
    }
    res.send("File deleted successfully");
  });
});

app.post("/upload", upload.single("image"), (req: any, res) => {
  console.log(req.file.filename);
  res.json({
    url: `${req.file.filename}`,
  });
});

app.listen(process.env.PORT);
