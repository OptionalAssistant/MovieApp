import { IUser } from "../types/typesClient";

export default class userDto{
    name: string;
    email : string;
    isActivated: boolean;

    public constructor(model : IUser){
        this.name = model.name;
        this.email = model.email;
        this.isActivated = model.isActivated;
    }
} 