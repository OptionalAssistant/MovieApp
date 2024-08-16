import { IUser } from "../types/typesClient";

export default class userDto{
    name: string;
    email : string;
    isActivated: boolean;
    roles : 'ADMIN' | 'USER';

    public constructor(model : IUser){
        this.name = model.name;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.roles = model.roles
    }
} 