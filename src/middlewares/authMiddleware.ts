import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { RegisterSchema, LoginSchema, AccountActivationSchema } from '../schemas/usersSchema';
import { userService } from '../services/index';
import { User } from '../models/usersModel';
import { verifyAccessToken, verifyRefreshToken } from '../helpers/tokenUtils';
import config from '../configs/config';
import { ResponseHandler } from '../handlers/errorHandler';

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
      return ResponseHandler.unauthorized(res, 'Authentication required, please login');
    }

    const decode = jwt.verify(token, config.jwt.secret as any) as any;

    if (!decode) {
      return ResponseHandler.unauthorized(res, 'Invalid token');
    }

    req.user = decode.id;
    req.userId = decode.id;
    next();
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      return ResponseHandler.unauthorized(res, 'Token expired');
    }
    ResponseHandler.serverError(res, 'Failed to authenticate token')
  }
};

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt-refresh', { session: false }, (err: any, user: User) => {
    const decodedJWT = verifyRefreshToken(req.body.refreshToken) as JwtPayload;

    if (err) return next(err);

    if (!decodedJWT) {
      return ResponseHandler.forbidden(res, 'Invalid refresh token')
    }

    req.user = decodedJWT;
    next();
  })(req, res, next);
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
     return  ResponseHandler.unauthorized(res, 'Authentication required')
    }
    const role = { ...req.user } as string;

    if (!roles.includes(role)) {
      return ResponseHandler.forbidden(res, 'Insufficient permission')
    }

    next();
  };
};

export const requireAdmin = requireRole('superadmin');

export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = RegisterSchema.safeParse(req.body);

    if (!result.success) {
      return ResponseHandler.badRequest(res,'Validation failed',result.error.errors.map(err => err.message) )
    }

    const { email, password, ...userData } = result.data;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return ResponseHandler.badRequest(res, 'User already exists')
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
    ResponseHandler.serverError(res, 'Internal server error')
  }
};

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      return ResponseHandler.badRequest(res, 'Validation failed', result.error.errors);
    }

    const { email, password } = result.data;

    const user = await userService.getUserByEmail(email);
    
   
   
    if (!user) {
      return ResponseHandler.unauthorized(res,'Invalid credentials' );
    }

    // if (!user.isActive) {
    //   return ResponseHandler.unauthorized(res,'Invalid credentials' );
    // }
    

    const isValidPassword = await bcrypt.compare(password, user.password as string);
   
    if (!isValidPassword) {
      return ResponseHandler.unauthorized(res,'Invalid credentials' );
    }

    req.user = user;
    
    next();
  } catch (error) {
    console.error('Login validation error:', error);
    ResponseHandler.serverError(res, 'Internal server error')
  }
};

export const validateAccountActivation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = AccountActivationSchema.safeParse(req.body);

    if (!result.success) {
      return ResponseHandler.badRequest(res, 'Validation failed',result.error.errors.map(err => err.message) )
    }

    const { password, token } = result.data;

    try {
      const decodedJWT = verifyAccessToken(token) as JwtPayload;
      const userId = decodedJWT.id as number;

      if (!decodedJWT) {
        return ResponseHandler.forbidden(res, 'Invalid activation token')
      }

      const existingUser = await userService.getUserById(userId);

      if (!existingUser) {
        return ResponseHandler.notFound(res, 'User not found')
      }

      if (existingUser.isActive) {
        return ResponseHandler.badRequest(res, 'Account already active. Try logging in.')
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      existingUser.password = hashedPassword;
      existingUser.isActive = true;

      req.user = existingUser;

      next();
    } catch (err) {
      if (err instanceof Error && err.message === 'jwt expired') {
        return ResponseHandler.unauthorized(res, 'Activation link expired')
      }
      ResponseHandler.serverError(res, 'Internal server error')
    }
  } catch (error) {
    console.error('Account Activation error:', error);
    ResponseHandler.serverError(res, 'Internal server error')
  }
};

