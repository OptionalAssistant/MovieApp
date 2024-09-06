import UserModel from "../models/User";
import { Request, Response } from "express";
import { Role } from "../types/typesClient";


function authorize(roles : Role[]) {
  return async function (req : Request, res : Response, next) {
      const user = await UserModel.findByPk(req.body.userId);

      if (!user || !roles.includes(user.roles)) {
          return res.status(403).json({ message: 'Access denied' })
      }

      next()
  }
}

export default authorize;