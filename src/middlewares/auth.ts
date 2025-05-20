import auth from '../helpers/auth.js';
import bcrypt from 'bcrypt';

const registerUser = async (req, res, next) => {
  try {
    const email = auth.checkEmail(req.body.email);
    const firstname = auth.checkFirstName(req.body.firstName);
    const lastname = auth.checkFirstName(req.body.lastName);
    const password = auth.checkPassword(req.body.password);
    const confirmedPassword = req.body.password;
    const phonenumber = req.body.phoneNumber
    if (password !== confirmedPassword) {
      throw Error('Please write the same password');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const registeredUser = {
      email,
      firstname,
      lastname,
      password: hashedPassword,
      phonenumber
    };
    

    req.user = registeredUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

 

export { registerUser };
