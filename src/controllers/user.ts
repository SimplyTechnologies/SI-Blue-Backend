import jwt from 'jsonwebtoken';
import { userService } from '../services';
import { Request, Response } from 'express';
import { User } from '../models/usersModel';
import { generateTokenForAccountActivation } from '../helpers/tokenUtils';
import config from '../configs/config';
import { sendEmail } from '../helpers/sendEmail';
import { InputUser } from '../services/user';
import { loadEmailTemplate } from '../services/emailTemplate';
import { SerializedAccountActivateData, SerializedUser, serializeUser, serializeAccountActivateData } from '../serializer/userSerializer';
import { ResponseHandler } from '../handlers/errorHandler';
declare global {
  namespace Express {
    interface Request {
      pendingUser?: User;
    }
  }
}

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
        link,
      });

      await sendEmail(restoredUser.email, emailSubject, emailHtml);
      return ResponseHandler.success(res, 'Account restored and activation email sent')
    }

    const pendingUser = req.pendingUser as InputUser;

    if (!pendingUser) {
      return ResponseHandler.badRequest(res,'User data missing' )
    }

    if (!pendingUser.email) {
      return ResponseHandler.badRequest(res, 'Email is required'  )
    }

    const newUser = { ...pendingUser, isActive: false };
    const inactiveUser = await userService.createInactiveUser(newUser);
    const token = generateTokenForAccountActivation(inactiveUser as User);
    const link = `${config.frontendUrl}/account-activation?token=${token}`;
    const emailSubject = `You've Been Invited – Activate Your Account`;

    const emailHtml = loadEmailTemplate('activateAccount.html', {
      firstName: pendingUser.firstName,
      productInfo: config.productInfo,
      link,
    });

    await sendEmail(pendingUser.email, emailSubject, emailHtml);

    ResponseHandler.success(res,'Account activation email sent' )
  } catch (error) {
    console.error('Error in addNewUser:', error);

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    ResponseHandler.serverError(res, 'Failed to send activation email')
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return ResponseHandler.notFound(res,'token not found' )
    }

    const decoded = jwt.verify(token, config.jwt.secret as string) as User;
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return ResponseHandler.notFound(res,'User not found' )
    }

    const formattedUser: SerializedAccountActivateData | null = serializeAccountActivateData(user);

    ResponseHandler.success(res, 'User retrieved successfully', {user: formattedUser})
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log('An unknown error occurred ');
    ResponseHandler.serverError(res, 'Internal server error')
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

     return ResponseHandler.unauthorized(res, 'Unauthorized')
    }
    const updatedUser = await userService.updateUser(userId, req.body);

    if (!updatedUser) {
     return ResponseHandler.notFound(res, 'User not found')
    }

    const formattedUser: SerializedUser | null = serializeUser(updatedUser);

    ResponseHandler.success(res, 'User updated successfully', {user: formattedUser})
  } catch (err) {
    console.error(err);
    ResponseHandler.serverError(res, 'Internal server error')
  }
};

const deleteInactiveUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id) {
     return ResponseHandler.badRequest(res, 'id missing')
    }
    const user = (await userService.getUserById(parseInt(id))) as User;
    
    if (!user) {
     return ResponseHandler.notFound(res, 'User not found')
    }

    const deleted = await userService.softDeleteUser(user.id);

    if (!deleted) {
     return ResponseHandler.serverError(res, 'Internal server error')
    }
    const emailSubject = `Your Account with ${config.productInfo} Has Been Deleted`
    const emailHtml = loadEmailTemplate('deleteAccount.html', {
      firstName: user.firstName,
      productInfo: config.productInfo,

    });

    await sendEmail(user.email, emailSubject, emailHtml);

    ResponseHandler.success(res, 'User deleted successfully')
  } catch (err) {
    console.error('Error in deleteInactiveUser:', err);
  ResponseHandler.serverError(res, 'Internal server error')
  }
};

export default {
  getUserById,
  addNewUser,
  getUsers,
  updateUser,
  deleteInactiveUser,
};
