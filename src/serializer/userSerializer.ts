import dotenv from 'dotenv';
import { UserAttributes } from '../models/usersModel';

dotenv.config();
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
  avatarUrl?: string | null;
}

interface SerializedAccountActivateData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export const serializeUser = (user: UserAttributes): SerializedUser => {
  const avatarUrl = user.avatarPublicId
    ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_auto,q_auto,f_auto/${user.avatarPublicId}`
    : null;

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
    avatarUrl,
  };
};

export const serializeAccountActivateData = (user: UserAttributes): SerializedAccountActivateData => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
  };
};

export type { SerializedUser, SerializedAccountActivateData };

