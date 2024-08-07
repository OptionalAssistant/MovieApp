import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";
import { response } from "express";
import MailService from '../services/mail-servive'

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
      process.env.SECRET_KEY,
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
      process.env.SECRET_KEY,
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

export const  getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user;

    return res.json({ ...userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
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

    const secret = process.env.SECRET_KEY + oldUser.passwordHash;

    const token = jwt.sign({ email: email, id: oldUser._id }, secret, {
      expiresIn: "10m",
    });

    const link = `http://localhost:4444/reset-password/${oldUser._id}/${token}`;
    console.log("email", email);

    MailService.sendMail(email,"Password recovery",`
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
         `);
    console.log(link);
    res.send("Success");
  } catch (error) {}
};

export const resetPassword = async (req, res) => {

  const { id, token } = req.params;

  const oldUser = await UserModel.findOne({ _id: id });

  if (!oldUser) {
    return res.send("User not exists");
  }

  const secret = process.env.SECRET_KEY + oldUser.passwordHash;

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

  const User = await UserModel.findOne({ _id: id });

  if (!User) {
    return res.send("User not exists");
  }
  const secret = process.env.SECRET_KEY +  User.passwordHash;

  try {
    const verify = jwt.verify(token, secret);

    const passwordHash = await bcrypt.hash(password, 10);

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

export const activateAccount = async(req, res) => {
  const userId = req.body.userId;

  const User = await UserModel.findOne({ _id: userId });

  if(!User){
    return res.send("User does not exist");
  }
  console.log(User);
  const secret = process.env.SECRET_KEY + User.isActivated;
  let link;
  console.log("Secret1",secret);
    try{
      const token = jwt.sign({ email: User.email,id : User.id}, secret, {
        expiresIn: "10m",
      });
       link = `http://localhost:4444/activate/${User._id}/${token}`;
    }
      catch(err){
      return  res.send("link expired....!");
      }


  MailService.sendMail( User.email,"Email verification",`
    <html>
        <body>
            <h1>Email verification</h1>
            <p>Hello,</p>
           <p>To verificy your email, please click the link below:</p>
            <a href= "${link}">${link}</a>
            <p>Thank you!</p>
        </body>
   </html>
`);
 return   res.send("That's okey");
    
};


export const activateLink = async(req,res)=>{
      const {id,token}  = req.params;

      const User = await UserModel.findOne({_id: id});

      if(!User){
        return res.send("User not found");
      }

      try{
        const secret = process.env.SECRET_KEY + User.isActivated;
        console.log("Secret2",secret);
        const verify = jwt.verify(token,secret);
        
        await UserModel.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              isActivated: true,
            },
          }
        );
    
        return res.send("Email is verified");
      }
      catch(error){
        console.log(error);
        return res.send("Link is expired....\n");
      }
}
