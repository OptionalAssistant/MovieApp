import { Schema, model } from "mongoose";
import { IUser } from "../types/typesClient";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true ,unique:true},
  email: { type: String, required: true,unique:true},
  passwordHash: { type: String, required: true },
  isActivated: {type: Boolean,default: false}
});

export default model<IUser>("User", userSchema);
