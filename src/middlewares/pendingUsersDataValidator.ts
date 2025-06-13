import { Response, Request, NextFunction } from "express";
import { UserSchemaWithoutPassword } from "../schemas/usersSchema";
import { InputUser } from '../services/user';
import { userService } from "../services";
import { ResponseHandler } from "../handlers/errorHandler";


declare global {
  namespace Express {
    interface Request {
      pendingUser?: InputUser;
      restoredUser?: any;
    }
  }
}

export const pendingUserDataValidateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = UserSchemaWithoutPassword.safeParse(req.body);

    if (!result.success) {
      return ResponseHandler.badRequest(res, 'Validation failed', result.error.errors)
    }
    const { firstName, lastName, phoneNumber, email } = result.data;

    const activeUser = await userService.getUserByEmail(email, false);

    if (activeUser) {
      return ResponseHandler.badRequest(res,'User with this email already exists.')
    }

    const deletedUser = await userService.getUserByEmail(email, true);

    if (deletedUser && deletedUser.deletedAt) {
      try {

        await userService.restoreUser(deletedUser.id);

        const updatedUser = await userService.updateUser(deletedUser.id, {
          firstName,
          lastName,
          phoneNumber
        });


        req.restoredUser = updatedUser;
        return next();

      } catch (error) {
        console.error('Error restoring user:', error);
        ResponseHandler.serverError(res,'Failed to restore user account');

      }
    }


    const pendingUser = {
      firstName,
      lastName,
      email,
      phoneNumber
    };

    req.pendingUser = pendingUser;
    next();

  } catch (err) {
    console.error('Error in pending user data validation', err);
    ResponseHandler.serverError(res, 'Internal server error')
  }
};
