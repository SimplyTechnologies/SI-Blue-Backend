import passport from 'passport';
import ms, { StringValue } from 'ms';
import { Request, Response, NextFunction } from 'express';

import { userService } from '../services';
import { generateAccessToken, generateRefreshToken } from '../helpers/tokenUtils.js';
import { maxAge } from '../configs/config.js';

import { User, UserRole } from '../models/usersModel';

const roles = ['user', 'superadmin'];
const accessTokenMaxAge = ms((maxAge.accessTokenMaxAge as StringValue) || '15m');
const refreshTokenMaxAge = ms((maxAge.refreshTokenMaxAge as StringValue) || '7d');

const registerUser = async (req: Request, res: Response) => {
  try {
    const registerUser = req.user as User;
    const role = registerUser.role as UserRole;

    if (!role) {
      registerUser.role = 'user';
    }
    if (!roles.includes(registerUser.role as string)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userId = await userService.createUser(registerUser);
    res.status(201).json({ userId, message: 'User registered successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log('An unknown error occured');
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: unknown, user: User, info: any) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: info?.message || 'Unauthorized' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessTokenMaxAge,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenMaxAge,
    });

    res.status(200).json({ message: 'Login successful' });
  })(req, res, next);
};

const refreshToken = (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessTokenMaxAge,
    });

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  registerUser,
  login,
  refreshToken,
};

