import bcrypt from 'bcrypt';
import { join } from 'path';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { generateAccessToken, generateRefreshToken } from '../helpers/tokenUtils.js';
import config from '../configs/config';

import { User } from '../models/usersModel';
import { RegisterInput, UserRoleType } from '../schemas/usersSchema';
import { sendEmail } from '../helpers/sendEmail';

const resetPasswordTemplatePath = join(__dirname, '../templates/resetPassword.html');
const resetPasswordTemplateSource = readFileSync(resetPasswordTemplatePath, 'utf8');
const resetPasswordTemplate = compile(resetPasswordTemplateSource);

const roles = ['user', 'superadmin'];

const registerUser = async (req: Request, res: Response) => {
  try {
    const registerUser = req.user as RegisterInput;

    const role = registerUser.role as UserRoleType;

    if (!role) {
      registerUser.role = 'user';
    }
    if (!roles.includes(registerUser.role as string)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await userService.createUser(registerUser);
    res.status(201).json({ user, message: 'User registered successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log('An unknown error occurred');
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: unknown, user: User, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Unauthorized' });
    }

    const { password, ...loggedUser } = user;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, req.body.remember);
    res.status(200).json({ user: { ...loggedUser }, tokens: { accessToken, refreshToken } });
  })(req, res, next);
};

const refreshToken = (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = generateAccessToken(user as User, '10m');
    const html = resetPasswordTemplate({ FRONTEND_URL: config.frontendUrl, TOKEN: token });
    await sendEmail(email, 'Reset Password', html);
    res.status(201).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { password, confirmPassword, token } = req.body;
  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    const decoded = jwt.verify(token as string, config.jwt.secret as string) as { id: number };
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPassword = await bcrypt.hash(password, 12);
    await userService.updateUser(user.id, { password: newPassword });
    res.status(201).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const activateAccount = async (req: Request, res: Response) => {
  const user = req.user as User;

  if (!user) {
   return res.status(404).json({ message: 'User not found' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, req.body.remember);
  const loggedUser = { firstName: user.firstName, lastName: user.lastName, email: user.email };

  res.status(201).json({ user: { ...loggedUser }, tokens: { accessToken, refreshToken } });
};

export default {
  registerUser,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  activateAccount,
};

