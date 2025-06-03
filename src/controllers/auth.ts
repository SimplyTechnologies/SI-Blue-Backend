import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { generateAccessToken, generateRefreshToken } from '../helpers/tokenUtils.js';

import { User } from '../models/usersModel';
import { RegisterInput, UserRoleType } from '../schemas/usersSchema';
import { sendEmail } from '../helpers/sendEmail';

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
    const token = generateAccessToken(user as User);
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail(email, 'Reset Password', `<a href="${link}">Click here to reset your password</a>`);

    res.status(201).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'Bad request' });
  }
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Bad request' });
  }
  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { id: number };
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    res.status(201).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export default {
  registerUser,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
