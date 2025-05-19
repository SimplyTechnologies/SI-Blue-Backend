import { userService } from "../services"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        const registerUser = req.user
        await userService.createUser(registerUser)
        res.status(201).json({message: "User registered succesfully"})
    } catch(err) {
        console.error(err.message)
        res.status(500).json({message: "Internal server error"})
    }


}

const getUserById = async (req, res) => {

}

const loginUser = async (req, res) => {
   try {
    const { email, password } = req.body
    if(!email || !password){
        return res.status(400).json({message: "Email and password required"})
    }
    const founded = await userService.getUserByEmail(email)
    if(!founded) {
       return res.status(401).json({message: "Email or password are invalid"})
    }
    const compared = await bcrypt.compare(password, founded.password)
    if(!compared) {
        return res.status(401).json({message: "Email or password invalid"})
    }
    const loginUser = { email, password }
    console.log(loginUser)
    const token = jwt.sign(loginUser, process.env.JWT_SECRET, {expiresIn:"120s"})
    return res.status(200).json({token,message: "User login successfully"})



   } catch(err){
    console.error(err.message)
    res.status(500).json({message: "Internal server error"})

   }

}

const  resetPassword = async () => {
    
}

const getAllUsers = async (req, res) => {

}

export default {
    registerUser,
    getAllUsers,
    getUserById,
    loginUser

}