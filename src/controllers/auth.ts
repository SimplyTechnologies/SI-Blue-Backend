import passport from 'passport';
import ms, { StringValue } from 'ms';

import { userService } from '../services';
import { generateAccessToken, generateRefreshToken } from '../helpers/tokenUtils.js';
import { maxAge } from '../configs/config.js';

const roles = ['user', 'superadmin'];
const accessTokenMaxAge = ms((maxAge.accessTokenMaxAge as StringValue) || '15m');
const refreshTokenMaxAge = ms((maxAge.refreshTokenMaxAge as StringValue) || '7d');

const registerUser = async (req, res) => {
  try {
    const registerUser = req.user;

    if (!registerUser.role) {
      registerUser.role = 'user';
    }
    if (!roles.includes(registerUser.role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await userService.createUser(registerUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
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

const refreshToken = (req, res) => {
  try {
    const user = req.user;

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

