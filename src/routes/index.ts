import { Router } from "express";
import passport from "passport";
import * as controller from "../controllers";

export const router = Router();

router.get("/", (_req, res) => res.send("Express + Typescript Server"));

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get("/logout", controller.logout);

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (_req, res) => {
    return res.status(200).json({ message: "Protected access granted" });
  }
);
