import jwt from "jsonwebtoken";
import { IAuthMe } from "../types/typesClient";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(403).json({ message: "Вы не авторизованы" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.body.userId = decoded.id;

    const user = await UserModel.findByPk(req.body.userId);

    if(!user){
      return res.send({message: "User not found"});
    }

    if (user.roles === "ADMIN") {
      return next();
    } else {
      return res.status(403).json({
        message: "Недостаточно прав! (Что-то пошло не так)",
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: "Вы не авторизованы! (Что-то пошло не так)",
    });
  }
};