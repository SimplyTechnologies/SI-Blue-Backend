import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { RegisterSchema, LoginSchema, AccountActivationSchema } from '../schemas/usersSchema';
import { userService } from '../services/index';
import { User } from '../models/usersModel';
import { verifyAccessToken, verifyRefreshToken } from '../helpers/tokenUtils';
import config from '../configs/config';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: number;
      validatedData?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required, please login' });
    }

    const decode = jwt.verify(token, config.jwt.secret as any) as any;

    if (!decode) {
      return res.status(402).json({ message: 'Invalid token' });
    }

    req.user = decode.id;
    req.userId = decode.id;
    next();
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      return res.status(401).json({ message: 'Token expired!' });
    }
    return res.status(500).json({ err: err instanceof Error ? err.message : err });
  }
};

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt-refresh', { session: false }, (err: any, user: User) => {
    const decodedJWT = verifyRefreshToken(req.body.refreshToken) as JwtPayload;

    if (err) return next(err);

    if (!decodedJWT) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    req.user = decodedJWT;
    next();
  })(req, res, next);
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }
    const role = { ...req.user } as string;

    if (!roles.includes(role)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        required: roles,
        current: role,
      });
    }

    next();
  };
};

export const requireAdmin = requireRole('superadmin');

export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = RegisterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map(err => err.message),
      });
    }

    const { email, password, ...userData } = result.data;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      ...userData,
      email,
      password: hashedPassword,
    };

    req.user = user;

    next();
  } catch (error) {
    console.error('Registration validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.errors,
      });
    }

    const { email, password } = result.data;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password as string);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Login validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const validateAccountActivation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = AccountActivationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map(err => err.message),
      });
    }

    const { password, token } = result.data;

    try {
      const decodedJWT = verifyAccessToken(token) as JwtPayload;
      const userId = decodedJWT.id as number;

      if (!decodedJWT) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      const existingUser = await userService.getUserById(userId);

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (existingUser.isActive) {
        return res.status(409).json({ message: 'Your account is already active. Try logging in.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      existingUser.password = hashedPassword;
      existingUser.isActive = true;

      req.user = existingUser;

      next();
    } catch (err) {
      if (err instanceof Error && err.message === 'jwt expired') {
        return res.status(401).json({ message: 'Activation link expired' });
      }
      return res.status(500).json({ err: err instanceof Error ? err.message : err });
    }
  } catch (error) {
    console.error('Account Activation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

