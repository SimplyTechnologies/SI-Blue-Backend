import { Request } from "express";
import { User } from "../models/usersModel";
import { RegisterInput } from "../schemas/usersSchema";

export interface CustomRequest extends Request {
    user?: User;
    registeredUser?: RegisterInput;
    pendingUser?: User;
    restoredUser?: User;
  }