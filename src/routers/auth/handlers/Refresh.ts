import { GatewayContract } from '@contracts';
import { authRouter } from '../AuthRouter';
import { authService, tokenService } from '@services/auth';
import { TokenPair } from 'libs/interfaces';

/**
 * Обновляем пару токенов
 */
authRouter.post(GatewayContract.refresh_token, async (req, res, next) => {
  try {
    const refresh_token: string = req.cookies[GatewayContract.REFRESH_TOKEN_FOR_COOKIE];
    const updated_token_pair: TokenPair = await tokenService.refreshToken(refresh_token);

    authService.setRefreshTokenInCookie(res, updated_token_pair.refresh_token);
    return res.json(updated_token_pair).status(201);
  } catch (e) {
    next(e);
  }
});
