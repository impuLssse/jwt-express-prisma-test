import { body } from 'express-validator';
import { authRouter } from '../AuthRouter';
import { GatewayContract } from '@contracts';
import { ValidationMiddleware } from '@middlewares';
import { authService } from '@services/auth';

/**
 * Создаем пользователя и пишем токен в куки
 */
authRouter.post(
  GatewayContract.register,
  body('user_name').isString(),
  body('password').isString(),
  body('confirm_password')
    .isString()
    .custom((input, meta) => input === meta.req.body?.password)
    .withMessage('Пароли не совпадают'),
  ValidationMiddleware,
  async (req, res, next) => {
    try {
      const registered_user = await authService.register(res, req.body);
      return res.json(registered_user.created_user).status(201);
    } catch (e) {
      next(e);
    }
  },
);
