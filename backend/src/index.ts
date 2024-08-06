import express from "express";

import mongoose from "mongoose";
import cors from "cors";
import { registerValidation, loginValidation } from "./validations";
import handleValidationErrors from "./utils/handleValidationErrors";
import { UserController } from "./controllers";
import path from "path";
import { body } from "express-validator";
import CheckAuth from "./utils/CheckAuth";
import dotenv from 'dotenv';

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
console.log(filePath);
app.set("views", filePath);
app.set("view engine", "ejs");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

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
app.get("/reset-password/:id/:token", UserController.resetPassword);
app.post(
  "/reset-password/:id/:token",
  body("password", "Пароль должен быть минимум 8 символов").isLength({
    min: 8,
  }),
  handleValidationErrors,
  UserController.updatePassword
);

app.listen(process.env.PORT);
