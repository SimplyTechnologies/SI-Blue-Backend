import { Response, Request, NextFunction } from "express";
import { UserSchemaWithoutPassword } from "../schemas/usersSchema";
import { userService } from "../services";

export const validateUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = UserSchemaWithoutPassword.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
              message: 'Validation failed',
              errors: result.error.errors,
            });
          }
          const {firstName, lastName, phoneNumber, email} = result.data

          const founded = await userService.getUserByEmail(email)
          if(founded){
            return res.status(400).json({message: 'User already exists'})
          }
          const user = {
            firstName,
            lastName,
            email,
            phoneNumber

          }
          req.user = user
          

          next()

    } catch(err) {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
    }
}