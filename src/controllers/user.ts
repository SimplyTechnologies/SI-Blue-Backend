import jwt from 'jsonwebtoken';
import { userService } from '../services';
import { Request, Response } from 'express';
import { User } from '../models/usersModel';

const createUser = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as User;
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword.dataValues });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log('An unknown error occurred ');
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getUserById,
  createUser,
  updateUser,
};
