import auth from"../helpers/auth"
import bcrypt from "bcrypt"

const registerUser = async (req, res, next) => {
    try {
        const email = auth.checkEmail(req.body.email)
        const name = auth.checkFirstName(req.body.name)
        const password = req.body.password
        const confirmedPassword = req.body.password
        if(password !== confirmedPassword){
            throw Error("Please write the same password")
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const registeredUser = {
            email,
            name,
            hashedPassword
        }
        console.log(registeredUser)

        req.user = registeredUser
        next()
        

    } catch(err) {
        console.error(err)
        res.status(400).json({message: "Please provide us email, name, password and confirmedPassword"})
    }
}

export default {
    registerUser
}