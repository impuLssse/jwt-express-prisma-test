import { AppConfig } from '@Config';
import { ApiError } from '@errors';
import { tokenService } from '@services/auth';
import { NextFunction, Request, Response } from 'express';
import { UserPayload } from 'libs/interfaces';

type MyRequest = Request & { user: UserPayload };

export function AuthMiddleware(req: MyRequest, res: Response, next: NextFunction) {
  try {
    const access_token = req.headers.authorization;

    if (!access_token) {
      throw ApiError.unAuth();
    }

    const token = access_token.split(' ')[1];
    if (!token) {
      throw ApiError.unAuth();
    }

    const token_payload = tokenService.validateToken<UserPayload>(
      token,
      AppConfig.JWT_ACCESS_TOKEN,
    );

    if (!token_payload) {
      throw ApiError.unAuth();
    }

    req.user = token_payload;
    return next();
  } catch (e) {
    next(e);
  }
}
