import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validateMiddleware = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        // Throw the error to be caught by the try-catch block in createData
        throw error;
      } else {
        // For any other errors, pass them to the next error handling middleware
        next(error);
      }
    }
  };
};

export default validateMiddleware;
