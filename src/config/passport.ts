import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
import argon2 from "argon2";
import { User } from "../../../database/src/entities/users";
import dotenv from "dotenv";

const jwtStrategy = passportJWT.Strategy;
const localStrategy = passportLocal.Strategy;

const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

dotenv.config();

const cookieExtractor = (req: Request) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.cookies["jwt"];
  }
  return jwt;
};

passport.use(
  "jwt",
  new jwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const { expiration } = jwtPayload;

        if (Date.now() > expiration) {
          done({ status: 401, message: "Unauthorised" }, false);
        }

        done(null, jwtPayload);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        if (!emailPattern.test(email)) {
          return done({ status: 400, message: "Email is invalid" });
        }
        email = email.toLowerCase();
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return done({ status: 400, message: "User already exists" });
        }
        const hash = await argon2.hash(password);
        const user = await User.create({
          email,
          password: hash,
          role: "admin",
        }).save();
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done({ status: 400, message: "Signup failed" });
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email: email.toLowerCase() },
        });
        if (!user) {
          return done({ status: 400, message: "User not found" });
        }
        const validate = await argon2.verify(user.password!, password);
        if (!validate) {
          return done({
            status: 401,
            message: "Username or password is incorrect",
          });
        }
        delete user.password;
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done({ status: 500, message: "Login failed" });
      }
    }
  )
);
