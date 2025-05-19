import auth from"../helpers/auth.js"
import { customerService } from "../services/index.js"

const customerDataValidate = (req, res, next) => {
    
    try {
        const email = auth.checkEmail(req.body.email)
        const founded = customerService.getCustomerByEmail(email)
        if(founded) {
            throw new Error("Customer already exists")
        }
    
        const firstName = auth.checkFirstName(req.body.firstName)
        const lastName = auth.checkLastName(req.body.lastName)
        const phoneNumber = auth.checkPhoneNumber(req.body.phoneNumber)
        
        
        const customerData = {
            firstName,
            lastName,
            phoneNumber,
            email,
        }
        
        req.user = customerData
        
        next()

    } catch(err){
        console.error(err)
        res.status(400).json({message: "Please provide us name, surname, phonenumber and email"})
    }

}

export default customerDataValidate