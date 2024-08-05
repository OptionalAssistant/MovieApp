import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";
import { response } from "express";
import nodemailer from "nodemailer";

interface IUser {
  name: string;
  email: string;
  passwordHash: string;
}

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name: req.body.name,
      email: req.body.email,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

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
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user;

    res.json({ ...userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить информацию о пользователе",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email", email);
  try {
    const oldUser = await UserModel.findOne({ email: email });

    if (!oldUser) {
      return res.send("User not exists");
    }

    const secret = "secret123" + oldUser.passwordHash;

    const token = jwt.sign({ email: email, id: oldUser._id }, secret, {
      expiresIn: "10m",
    });

    const link = `http://localhost:4444/reset-password/${oldUser._id}/${token}`;
    console.log('email',email);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "lehkiyshectkiy@gmail.com",
        pass: "bpnl zlpq tqrn nonn",
      },
    });
    const mailOptions = {
      from: "lehkiyshectkiy@gmail.com",
      to: email,
      subject: "Password recovery",
      text: "",
      html: `
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
        `,
    };
    const info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.send().status(404);
      } else {
        console.log("Email sent: ", info.response);
        res.send("ookkkey");
      }
    });

    console.log(link);
  } catch (error) {}
};

export const resetPassword = async (req, res) => {
  console.log("kek");
  const { id, token } = req.params;
  console.log(req.params);

  const oldUser = UserModel.findOne({ _id: id });

  if (!oldUser) {
    return res.send("User not exists");
  }

  const secret = "secret123" + (await oldUser).passwordHash;

  try {
    const verify = jwt.verify(token, secret);

    res.render("index.ejs", { email: verify.email });
  } catch (error) {
    res.send("Not verified");
  }
};

export const updatePassword = async (req, res) => {
  const { password } = req.body;

  const { id, token } = req.params;

  const User = UserModel.findOne({ _id: id });

  if (!User) {
    return res.send("User not exists");
  }
  const secret = "secret123" + (await User).passwordHash;

  try {
    const verify = jwt.verify(token, secret);

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("password ", password);

    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          passwordHash,
        },
      }
    );

    return res.send("All right");
  } catch (error) {
    console.log(error);
    return res.send("Not verified\n");
  }
};
