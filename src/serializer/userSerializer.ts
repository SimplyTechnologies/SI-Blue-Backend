import { UserAttributes } from "../models/usersModel";

interface SerializedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SerializedAccountActivateData {
  firstName: string;
  lastName: string;
  email: string;
}

export const serializeUser = (user: UserAttributes): SerializedUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.createdAt,
  };
};

export const serializeAccountActivateData = (user: UserAttributes): SerializedAccountActivateData => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
};

export type { SerializedUser, SerializedAccountActivateData };

