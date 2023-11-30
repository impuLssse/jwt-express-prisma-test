import { ApiError } from '@errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const badRequestCode = 500;

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(500).json({
      statusCode: badRequestCode,
      message: error.message,
      errors: [error.stack],
    });
  }

  return res.status(500).json({
    statusCode: badRequestCode,
    errors: ['Internal Server Error'],
  });
};
