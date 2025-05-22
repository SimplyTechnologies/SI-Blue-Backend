import jwt from 'jsonwebtoken';
import { User } from '../models/usersModel';

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (user:User) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user:User) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

