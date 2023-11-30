import { userService } from '@services/user';
import { userRouter } from '../UserRouter';
import { param } from 'express-validator';
import { ValidationMiddleware } from '@middlewares';

userRouter.get(
  '/:user_id',
  param('user_id').isUUID().withMessage('user_id должен быть указан в формате UUID'),
  ValidationMiddleware,
  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const found_user = await userService.findUser({ id: user_id });

      return res
        .json({
          id: found_user.id,
          user_name: found_user.user_name,
        })
        .status(200);
    } catch (e) {
      next(e);
    }
  },
);
