import { ApiError } from '@errors';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const validation = validationResult(req);

  /**
   * If validation result is have errors, go to bad request
   */
  if (!validation.isEmpty()) {
    throw ApiError.badRequest(validation.array());
  }

  return next();
};
