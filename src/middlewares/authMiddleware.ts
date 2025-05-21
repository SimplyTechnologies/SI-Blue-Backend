import passport from 'passport';
import bcrypt from 'bcrypt';
import { checkEmail, checkFirstName, checkPassword } from '../helpers/auth';

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

export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden: SuperAdmin access required' });
  }
  next();
};

export const validateRegistration = async (req, res, next) => {
  try {
    const email = checkEmail(req.body.email);
    const firstname = checkFirstName(req.body.firstName);
    const lastname = checkFirstName(req.body.lastName);
    const password = checkPassword(req.body.password);
    const confirmedPassword = req.body.password;
    const phonenumber = req.body.phoneNumber;
    if (password !== confirmedPassword) {
      throw Error('Please write the same password');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const registeredUser = {
      email,
      firstname,
      lastname,
      password: hashedPassword,
      phonenumber,
    };

    req.user = registeredUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const checkRole = roles => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userRole = req.user.role;

    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Access denied.',
      });
    }

    next();
  };
};
