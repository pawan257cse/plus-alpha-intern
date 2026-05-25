import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { sendError } from "../utils/apiResponse.js";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg as string, 422);
      return;
    }
    next();
  };
};
