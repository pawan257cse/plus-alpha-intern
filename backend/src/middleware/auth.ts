import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";

export interface AuthRequest extends Request<Record<string, string>, any, Record<string, any>> {
  user?: IUser;
  file?: Express.Multer.File;
}

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
      sendError(res, "Not authorized", 401);
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
      sendError(res, "User not found", 401);
      return;
    }

    req.user = user;
    next();
  } catch {
    sendError(res, "Invalid or expired token", 401);
  }
};

export const authorize =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, "Access denied", 403);
      return;
    }
    next();
  };
