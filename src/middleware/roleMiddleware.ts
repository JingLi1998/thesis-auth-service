import { NextFunction, Response } from "express";
import { ResourcePolicy } from "../../../database/src/entities/supply-chain";

export const roleMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role && req.user.role === "admin") {
    return next();
  } else if (req.params.id) {
    const resource_id = req.params.id;
    const resource_type = req.path.substring(1);
    const user_email = req.user.email;
    const resource_policy = await ResourcePolicy.findOne({
      where: {
        resource_id,
        resource_type,
        user_email,
      },
    });
    if (resource_policy && resource_policy.permission === "read") {
      return next();
    }
  } else {
    return res
      .status(403)
      .json({ status: 403, message: "Insufficient access privileges" });
  }
};
