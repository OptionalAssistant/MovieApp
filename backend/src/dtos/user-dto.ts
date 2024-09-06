import { IUser, Role } from "../types/typesClient";

export default class userDto{
    name: string;
    email : string;
    isActivated: boolean;
    roles : Role;
    avatar: string;

    public constructor(model : IUser){
        this.name = model.name;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.roles = model.roles;
        this.avatar = model.avatar;
    }
} 