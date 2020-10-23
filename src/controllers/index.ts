import passport from "passport";
import { asyncMiddleware } from "../middleware/asyncMiddleware";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const signup = asyncMiddleware(async (req, res) => {
  passport.authenticate("signup", (error, user) => {
    if (error) {
      return res.status(error.status).json(error);
    }
    return res.status(201).json(user);
  })(req, res);
});

export const login = asyncMiddleware(async (req, res) => {
  passport.authenticate("login", (error, user) => {
    if (error) {
      return res.status(error.status).json(error);
    } else if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Username or password incorrect" });
    }

    const payload = {
      email: user.email,
      expiration: Date.now() + parseInt(process.env.EXPIRATION_TIME_IN_MS!),
    };

    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET!);

    res.cookie("jwt", token, { httpOnly: true, secure: false });

    return res.status(200).json({ user, message: "Logged in successfully" });
  })(req, res);
});

export const logout = asyncMiddleware(async (req, res) => {
  if (req.cookies["jwt"]) {
    res.clearCookie("jwt").status(200).json({ message: "You have logged out" });
  } else {
    res.status(401).json({ status: 401, message: "Invalid JWT" });
  }
});
