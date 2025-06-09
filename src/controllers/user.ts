
import jwt from 'jsonwebtoken';
import { userService } from '../services';
import { Request, Response } from 'express';
import { User } from '../models/usersModel';
import {  generateTokenForAccountActivation } from '../helpers/tokenUtils';
import config from '../configs/config';
import { sendEmail } from '../helpers/sendEmail';
import { InputUser } from '../services/user';
import { loadEmailTemplate } from '../services/emailTemplate';
declare global {
  namespace Express {
    interface Request {
      pendingUser?: User;
    }
  }
};

const addNewUser = async (req: Request, res: Response) => {
  try {
    
    if (req.restoredUser) {
      const restoredUser = req.restoredUser;
    
      const token = generateTokenForAccountActivation(restoredUser as User);
      const link = `${config.frontendUrl}/account-activation?token=${token}`;
      const emailSubject = `Welcome Back – Activate Your Account`;

      const emailHtml = loadEmailTemplate('activateAccount.html', {
        firstName: restoredUser.firstName,
        productInfo: config.productInfo,
        link
      });

      await sendEmail(restoredUser.email, emailSubject, emailHtml);

      return res.status(200).json({  
        message: 'Account restored and activation email sent',

      });
    }

   
    const pendingUser = req.pendingUser as InputUser;

    if (!pendingUser) {
      return res.status(400).json({ message: 'User data missing' });
    }
    
    if (!pendingUser.email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const newUser = { ...pendingUser, isActive: false };
    const inactiveUser = await userService.createInactiveUser(newUser);
    const token = generateTokenForAccountActivation(inactiveUser as User);
    const link = `${config.frontendUrl}/account-activation?token=${token}`;
    const emailSubject = `You've Been Invited – Activate Your Account`;

    const emailHtml = loadEmailTemplate('activateAccount.html', {
      firstName: pendingUser.firstName,
      productInfo: config.productInfo,
      link
    });

    await sendEmail(pendingUser.email, emailSubject, emailHtml);

    res.status(200).json({ 
      message: 'Account activation email sent',
    });

  } catch (error) {
    console.error('Error in addNewUser:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Failed to send activation email' });
  }
};



const getUserById = async (req: Request, res: Response) => {
  try {
    const {token} = req.params;
    if (!token) {
      return res.status(401).json({ message: 'token not found' });
    }

    const decoded = jwt.verify(token, config.jwt.secret as string) as User;
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const {firstName, lastName, email} = user
    const serializerUser = {
      email,
      firstName,
      lastName
      }
    res.status(200).json({ user:serializerUser});
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log('An unknown error occurred ');
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, page, offset } = req.query;
    const pageNum = page ? Math.max(Number(page), 1) : 1;
    const limit = offset ? Number(offset) : 25;
    const result = await userService.getAllUsers({
      search: search as string,
      page: pageNum,
      offset: limit,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
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

const deleteInactiveUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const user = await userService.getUserById(parseInt(id)) as User;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deleted = await userService.softDeleteUser(user.id);
    
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Error in deleteInactiveUser:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getUserById,
  addNewUser,
  getUsers,
  updateUser,
  deleteInactiveUser
};
