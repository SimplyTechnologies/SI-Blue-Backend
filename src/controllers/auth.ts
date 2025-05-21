import { userService } from '../services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const roles = ['user', 'superadmin']

const registerUser = async (req, res) => {
  try {
    const registerUser = req.user;
    if(!registerUser.role) {
      registerUser.role = 'user'
    }
    if(!roles.includes(registerUser.role)){
      return res.status(400).json({message: 'Invalid role'})
    }
    await userService.createUser(registerUser);
    res.status(201).json({ message: 'User registered succesfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const founded = await userService.getUserByEmail(email);
    
    if (!founded) {
      return res.status(401).json({ message: 'Email or password are invalid' });
    }
    const hashPassword = founded.password

    const compared = await bcrypt.compare(password, hashPassword);
    if (!compared) {
      return res.status(401).json({ message: 'Email or password invalid' });
    }

    const userPayload = {
      id: founded.id,
      email: founded.email,
      role: founded.role
    };
    const { hashedPassword, ...returnedUser} = founded

    const accessToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '15m' });

    const refreshToken = jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'User login successfully',
      user: {
        id: founded.id,
        email: founded.email,
        role: founded.role
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await userService.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const newAccessToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('accessToken',newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } )

    return res.status(200).json({
      accessToken: newAccessToken,
      message: 'Token refreshed successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        message: 'Invalid tokens',
      });
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return res.status(200).json({
      message: 'Successfully logged out',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
