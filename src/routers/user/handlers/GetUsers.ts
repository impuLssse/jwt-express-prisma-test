import { userService } from '@services/user';
import { userRouter } from '../UserRouter';
import { AuthMiddleware } from '@middlewares';

userRouter.get('/', AuthMiddleware, async (req, res, next) => {
  try {
    const found_users = await userService.findUsers();
    return res.json(found_users).status(200);
  } catch (e) {
    next(e);
  }
});
