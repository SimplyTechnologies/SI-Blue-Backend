import passport from 'passport';
import { VerifiedCallback } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { User } from '../models/usersModel';
import userService from '../services/user.js';

interface JwtPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export const configurePassport = () => {
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email);

          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          const isMatch = await bcrypt.compare(password, user.password as string);

          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          return done(null, user as User);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          req => {
            if (req && req.cookies) {
              return req.cookies['accessToken'];
            }
            return null;
          },

          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: process.env.JWT_SECRET as string,
      },
      async (payload, done: VerifiedCallback) => {
        try {
          const user = await userService.getUserById(payload.id);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );

  passport.use(
    'jwt-refresh',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          req => {
            if (req && req.cookies) {
              return req.cookies['refreshToken'];
            }
            return null;
          },
        ]),
        secretOrKey: process.env.JWT_REFRESH_SECRET as string,
      },
      async (payload: JwtPayload, done: VerifiedCallback) => {
        try {
          const user = await userService.getUserById(payload.id);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
