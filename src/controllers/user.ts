import jwt from 'jsonwebtoken';
import { userService } from '../services';

const getUserById = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword.dataValues });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgetPassword = async (req, res) => {

};

const requestPasswordReset = async (res, req) => {

}

const refreshToken = async (req, res) => {

}

const getAllUsers = async (req, res) => {};

export default {
  getAllUsers,
  getUserById,
  forgetPassword,
  requestPasswordReset,
  refreshToken
};
