import { Schema, model, connect } from "mongoose";

interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  isActivated: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true ,unique:true},
  email: { type: String, required: true,unique:true},
  passwordHash: { type: String, required: true },
  isActivated: {type: Boolean,default: false}
});

export default model<IUser>("User", userSchema);
