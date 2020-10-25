import { NextFunction, Response } from "express";

export const roleMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .json({ status: 403, message: "Insufficient access privileges" });
  }
};
