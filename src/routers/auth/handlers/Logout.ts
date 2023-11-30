import { GatewayContract } from '@contracts';
import { authRouter } from '../AuthRouter';
import { ApiError } from '@errors';
import { authService, tokenService } from '@services/auth';

/**
 * Очищаем куки и выходим из учетки
 */
authRouter.post(GatewayContract.logout, async (req, res, next) => {
  try {
    const refresh_token: string = req.cookies[GatewayContract.REFRESH_TOKEN_FOR_COOKIE];

    if (!refresh_token) {
      throw ApiError.badRequest(['Already logout']);
    }

    const found_token = await tokenService.findToken(refresh_token);
    if (!found_token) {
      throw ApiError.badRequest(['Already logout']);
    }

    const removed_token = await tokenService.removeToken(refresh_token);

    authService.removeRefreshTokenFromCookie(res);
    return res.json(removed_token).status(200);
  } catch (e) {
    next(e);
  }
});
