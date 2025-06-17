import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import passport from 'passport';
import jwt from 'jsonwebtoken';

import { compile } from 'handlebars';

import { userService } from '../services';
import { generateAccessToken, generateRefreshToken } from '../helpers/tokenUtils.js';
import config from '../configs/config';

import { User } from '../models/usersModel';
import { RegisterInput, UserRoleType } from '../schemas/usersSchema';
import { sendEmail } from '../helpers/sendEmail';
import { SerializedUser, serializeUser } from '../serializer/userSerializer';
import { ResponseHandler } from '../handlers/errorHandler';

const resetPasswordTemplatePath = join(__dirname, '../templates/resetPassword.html');
const resetPasswordTemplateSource = readFileSync(resetPasswordTemplatePath, 'utf8');
const resetPasswordTemplate = compile(resetPasswordTemplateSource);

const roles = ['user', 'superadmin'];

const registerUser = async (req: Request, res: Response) => {
  try {
    const registerUser = req.registeredUser as RegisterInput;

    const role = registerUser.role as UserRoleType;

    if (!role) {
      registerUser.role = 'user';
    }
    if (!roles.includes(registerUser.role as string)) {
      return ResponseHandler.badRequest(res, 'Invalid role');
    }

    const user = await userService.createUser(registerUser);

    ResponseHandler.created(res, 'User registered successfully', { user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log('An unknown error occurred');
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: unknown, user: User, info: any) => {
    if (err) return next(err);
    if (!user) {
      return ResponseHandler.unauthorized(res, info?.message || 'Unauthorized');
    }

    const loggedUser: SerializedUser | null = serializeUser(user);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, req.body.remember);

    ResponseHandler.success(res, 'Login successfully', {
      user: { ...loggedUser },
      tokens: { accessToken, refreshToken },
    });
  })(req, res, next);
};

const refreshToken = (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    if (!user) {
      return ResponseHandler.unauthorized(res, 'Unauthorized')
    }

    const accessToken = generateAccessToken(user);

    ResponseHandler.success(res, 'Access token send successfully', { accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user || !user.isActive) {
      return ResponseHandler.notFound(res, 'No account found with this email address.');
    }
    await userService.updateUser(user.id, { tokenInvalidatedAt: new Date() });
    const token = generateAccessToken(user as User, '10m');
    const html = resetPasswordTemplate({ FRONTEND_URL: config.frontendUrl, TOKEN: token });
    await sendEmail(email, 'Reset Password', html);
    ResponseHandler.success(res, 'Password reset email send successfully');
  } catch (err) {
    ResponseHandler.serverError(res, 'Failed to process request');
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { password, confirmPassword, token } = req.body;
  if (!token || !password || !confirmPassword) {
    return ResponseHandler.badRequest(res, 'Bad request');
  }

  try {
    const decoded = jwt.verify(token as string, config.jwt.secret as string) as { id: number };
    const user = await userService.getUserById(decoded.id);

    if (!user || !user.isActive) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const newPassword = await bcrypt.hash(password, 12);
    await userService.updateUser(user.id, { password: newPassword });
    ResponseHandler.success(res, 'Password reset successfully');
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'JsonWebTokenError') {
        return ResponseHandler.unauthorized(res, 'Invalid token');
      }
      if (err.name === 'TokenExpiredError') {
        return ResponseHandler.unauthorized(res, 'Token has expired');
      }
    }

    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const activateAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const updatedUser = await userService.updateUserPasswordActiveStatus(user);

    if (!updatedUser) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const formattedUser: SerializedUser | null = serializeUser(updatedUser);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, req.body.remember);
    ResponseHandler.success(res, 'User activated successfully', {
      user: { ...formattedUser },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export default {
  registerUser,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  activateAccount,
}
