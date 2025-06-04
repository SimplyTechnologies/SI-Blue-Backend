import jwt from 'jsonwebtoken';
import { userService } from '../services';
import { Request, Response } from 'express';
import { User } from '../models/usersModel';
import { generateAccessToken } from '../helpers/tokenUtils';
import config from '../configs/config';
import { sendEmail } from '../helpers/sendEmail';
import { InputUser } from '../services/user';
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const addNewUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = req.user as InputUser;
    
    if (!user) {
      return res.status(400).json({ message: 'User data missing' });
    }

    const token = generateAccessToken(user as User);
    const link = `${config.frontendUrl}/account-activation?token=${token}`;
    console.log(link);

    try {
      await sendEmail(email, 'Account-activation', `<a href="${link}">Click here to activate your profile</a>`);
      await userService.addNewUser(user)
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



export default {
  getUserById,
  addNewUser
};
