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
}

const addNewUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const pendingUser = req.pendingUser as InputUser;
    
    if (!pendingUser) {
      return res.status(400).json({ message: 'User data missing' });
    }

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
            Activate My Account
          </a>
        </div>
        
        <p><strong>Important:</strong> This link is valid for <strong>24 hours</strong>. After that, it will expire for security reasons.</p>
        
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
      await userService.addNewUser(pendingUser)
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
