import { Router } from "express";
import * as controller from "../controllers";
import { jwtMiddleware } from "../middleware/jwtMiddleware";

export const router = Router();

router.get("/", (_req, res) => res.send("Express + Typescript Server"));

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get("/logout", controller.logout);

router.get("/current-user", jwtMiddleware, controller.currentUser);

router.get("/protected", jwtMiddleware, (_req, res) => {
  return res.status(200).json({ message: "Protected access granted" });
});
