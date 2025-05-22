import passport from 'passport';
import bcrypt from 'bcrypt';
import { checkEmail, checkFirstName, checkPassword } from '../helpers/auth';
import { userService } from '../services';
export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
export const authenticateRefreshToken = (req, res, next) => {
    passport.authenticate('jwt-refresh', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
export const validateRegistration = async (req, res, next) => {
    try {
        const email = checkEmail(req.body.email);
        if (!email) {
            throw Error('Please provide us an email');
        }
        const founded = await userService.getUserByEmail(email);
        if (founded) {
            throw Error('User already exists');
        }
        if (!req.body.firstName ||
            !req.body.lastName ||
            !req.body.phoneNumber ||
            !req.body.password ||
            !req.body.confirmedPassword) {
            throw Error('Please provide us firstname, lastname, password and confirmedPasswprd');
        }
        const first_name = checkFirstName(req.body.firstName);
        const last_name = checkFirstName(req.body.lastName);
        const password = checkPassword(req.body.password);
        const confirmedPassword = req.body.password;
        const phone_number = req.body.phoneNumber;
        if (password !== confirmedPassword) {
            throw Error('Please write the same password');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const registeredUser = {
            email,
            first_name,
            last_name,
            password: hashedPassword,
            phone_number,
        };
        req.user = registeredUser;
        next();
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
    }
};
//# sourceMappingURL=authMiddleware.js.map