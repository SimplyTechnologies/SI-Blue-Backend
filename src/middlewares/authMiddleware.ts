import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { RegisterSchema, LoginSchema } from '../schemas/usersSchema';
import { userService } from '../services/index';
import { User } from '../models/usersModel';
import { verifyRefreshToken } from '../helpers/tokenUtils';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validatedData?: any;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: User) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    req.user = user;
    next();
  })(req, res, next);
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
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
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
