import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { User } from '../models/usersModel';

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (user: User, expiresIn?: StringValue) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: expiresIn || '3m' });
};

export const generateRefreshToken = (user: User, remember: boolean) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: remember ? '30d' : '1d' });
};
export const generateTokenForAccountActivation = (user: User) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn:  '3m' });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
}