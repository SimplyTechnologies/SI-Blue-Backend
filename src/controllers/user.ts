import jwt from 'jsonwebtoken';
import { userService } from '../services';
import { Request, Response } from 'express';
import { User } from '../models/usersModel';
import { generateAccessToken } from '../helpers/tokenUtils';
import config, { productInfo } from '../configs/config';
import { sendEmail } from '../helpers/sendEmail';
import { InputUser } from '../services/user';
declare global {
  namespace Express {
    interface Request {
      pendingUser?: User;
    }
  }
};

const addNewUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const pendingUser = req.pendingUser as InputUser;
    
    if (!pendingUser) {
      return res.status(400).json({ message: 'User data missing' });
    }
    const userWithInactiveStatus = {
      ...pendingUser,
      isActive: false,
    };

    const token = generateAccessToken(pendingUser as User);
    const link = `${config.frontendUrl}/account-activation?token=${token}`;
    const emailSubject = `You've been Invited Activate Your Account`;
    const emailTemplate = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Hi ${pendingUser.firstName || 'there'},</h2>
    
    <p>You've been added to <strong>${productInfo}</strong> by administrator.</p>
    
    <p>To access your account, please activate it by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" 
         style="background-color: #007bff; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 4px; display: inline-block;">
        👉 Activate My Account
      </a>
    </div>
    
    <p>This link is valid for <strong>24 hours</strong>. After that, it will expire for security reasons.</p>
    
    <p>Once you click the link, you'll be taken to a secure page to set your password and complete the activation process.</p>
    
    <p>If you weren't expecting this invitation, you can safely ignore this message.</p>
    
    <p>Looking forward to having you with us!</p>
    
    <p>Best regards,<br>
    <strong>The ${productInfo} Team</strong></p>
    
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #666;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">${link}</span>
    </p>
  </div>
`;


    try {
      await sendEmail(email, emailSubject, emailTemplate);
      await userService.addNewUser(userWithInactiveStatus)
      return res.status(200).json({ message: 'Account activation email sent' });
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      return res.status(500).json({ message: 'Failed to send activation email' });
    }

  } catch (err) {
    console.error('Error in addNewUser:', err);
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
    const { userId } = req.params;

    const user = await userService.getUserById(parseInt(userId));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isActive) {
      return res.status(400).json({ message: 'Cannot delete active user' });
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
