import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";
import MailService from "../services/mail-servive";
import userDto from "../dtos/user-dto.js";
import {
  AuthMeResponce,
  ILoginForm,
  IRegisterForm,
  LoginResponce,
  UserData,
  UserDataToken,
} from "../types/typesRest.js";

import { Request, Response } from "express";
import { ActivateParams, IAuthMe } from "../types/typesClient.js";
import path from "path";
import fs from "fs";

export const register = async (
  req: Request<{}, {}, IRegisterForm>,
  res: Response<LoginResponce>
) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userCheck = await UserModel.findOne({
      where: { email: req.body.email },
    });

    if (userCheck) {
      return res
        .status(500)
        .json({ message: "Пользователь с таким email уже существует" });
    }
    const doc = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_EXPIRE_DATE,
        subject: "accessToken"
      }
    );
    console.log("Token generated",token);

    const userData = new userDto(user);

    const userDataToken: UserDataToken = {
      data: userData,
      token,
    };

    return res.json(userDataToken);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};
export const login = async (
  req: Request<{}, {}, ILoginForm>,
  res: Response<LoginResponce>
) => {
  try {
    const user = await UserModel.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(404).json({
        message: "Неверный логин или пароль!",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    const userData = new userDto(user);

    const userDataToken: UserDataToken = {
      data: userData,
      token,
    };

    res.json(userDataToken);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (
  req: Request<{}, {}, IAuthMe>,
  res: Response<AuthMeResponce>
) => {
  try {
    const user = await UserModel.findByPk(req.body.userId);
    console.log(req.body.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const userData = new userDto(user) as UserData;

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить информацию о пользователе",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const oldUser = await UserModel.findOne({ where: { email: email } });

    if (!oldUser) {
      return res.send("User not exists");
    }

    const secret = process.env.ACCESS_SECRET_KEY + oldUser.passwordHash;

    const token = jwt.sign({ email: email, id: oldUser.id }, secret, {
      expiresIn: "10m",
    });

    const link = `http://localhost:4444/reset-password/${oldUser.id}/${token}`;

    MailService.sendMail(
      email,
      "Password recovery",
      `
             <html>
                 <body>
                     <h1>Password Recovery</h1>
                     <p>Hello,</p>
                    <p>To reset your password, please click the link below:</p>
                     <a href= "${link}">${link}</a>
                     <p>If you did not request this password reset, please ignore this email.</p>
                     <p>Thank you!</p>
                 </body>
            </html>
         `
    );

    res.send("Success");
  } catch (error) {
    console.log("error", error);
  }
};

export const resetPassword = async (req: Request<ActivateParams>, res) => {
  const { id, token } = req.params;

  const oldUser = await UserModel.findByPk(id);

  if (!oldUser) {
    return res.send("User not exists");
  }

  const secret = process.env.ACCESS_SECRET_KEY + oldUser.passwordHash;

  try {
    const verify = jwt.verify(token, secret);

    res.render("index.ejs", { email: verify.email });
  } catch (error) {
    res.send("Link expired");
  }
};

export const updatePassword = async (req, res) => {
  const { password } = req.body;

  const { id, token } = req.params;

  const User = await UserModel.findByPk(id);

  if (!User) {
    return res.send("User not exists");
  }
  const secret = process.env.ACCESS_SECRET_KEY + User.passwordHash;

  try {
    const verify = jwt.verify(token, secret);

    const passwordHash = await bcrypt.hash(password, 10);

    User.update({ passwordHash });

    return res.send("Password has changed!");
  } catch (error) {
    return res.send("Not verified\n");
  }
};

export const activateAccount = async (req: Request<{}, {}, IAuthMe>, res) => {
  const userId = req.body.userId;

  const User = await UserModel.findByPk(userId);

  if (!User) {
    return res.send("User does not exist");
  }

  const secret = process.env.ACCESS_SECRET_KEY + User.isActivated;
  let link;
  try {
    const token = jwt.sign({ email: User.email, id: User.id }, secret, {
      expiresIn: "10m",
    });
    link = `http://localhost:4444/activate/${User.id}/${token}`;
  } catch (err) {
    return res.send("link expired....!");
  }

  MailService.sendMail(
    User.email,
    "Email verification",
    `
    <html>
        <body>
            <h1>Email verification</h1>
            <p>Hello,</p>
           <p>To verificy your email, please click the link below:</p>
            <a href= "${link}">${link}</a>
            <p>Thank you!</p>
        </body>
   </html>
`
  );
  return res.send("That's okey");
};

export const activateLink = async (req: Request<ActivateParams>, res) => {
  const { id, token } = req.params;

  const User = await UserModel.findByPk(id);

  if (!User) {
    return res.send("User not found");
  }

  try {
    const secret = process.env.ACCESS_SECRET_KEY + User.isActivated;

    jwt.verify(token, secret);

    await User.update({ isActivated: true });

    return res.send("Email is verified");
  } catch (error) {
    console.log(error);
    return res.send("Link is expired....\n");
  }
};

export const deleteAvatar = async (req: Request<{}, {}, IAuthMe>, res) => {
  try {
    const user = await UserModel.findByPk(req.body.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar) {
      const filePath = path.join(__dirname, "..", "..", "uploads", user.avatar);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        }
        console.log("All right");
      });
      user.avatar = null;
    }

    await user.save();

    return res.send({ message: "Success" });
  } catch (error) {
    console.log("ooops smth went wrong during udationg avatar", error);
    return res.send({ message: "Error" });
  }
};
