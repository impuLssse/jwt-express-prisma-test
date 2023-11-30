import { GatewayContract } from '@contracts';
import { authRouter } from '../AuthRouter';
import { body } from 'express-validator';
import { ValidationMiddleware } from '@middlewares';
import { authService } from '@services/auth';

/**
 * Пишем в куки токен и входим в учетку
 */
authRouter.post(
  GatewayContract.login,
  body('user_name').isString(),
  body('password').isString(),
  ValidationMiddleware,
  async (req, res, next) => {
    try {
      const found_user = await authService.login(res, req.body);
      return res.json(found_user.is_logined).status(200);
    } catch (e) {
      next(e);
    }
  },
);
