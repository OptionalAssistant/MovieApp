import { Schema, model, connect } from "mongoose";

interface IUser {
  name: string;
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true ,unique:true},
  email: { type: String, required: true,unique:true},
  passwordHash: { type: String, required: true },
});

export default model<IUser>("User", userSchema);
