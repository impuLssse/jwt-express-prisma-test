import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { prisma } from '@App';
import { AppConfig } from '@Config';
import { Token } from '@prisma/client';
import { TokenPair, User, UserPayload } from 'libs/interfaces';
import { ApiError } from '@errors';
import { userService } from '@services/user';

class TokenService {
  async findToken(refresh_token: string) {
    return prisma.token.findUnique({
      where: {
        refresh_token,
      },
    });
  }

  async refreshToken(token: string) {
    if (!token) {
      throw ApiError.unAuth();
    }

    const token_payload = this.validateToken<UserPayload>(
      token,
      AppConfig.JWT_REFRESH_TOKEN,
    );
    const found_token = await this.findToken(token);

    /**
     * Если токен не найден либо он не найден в БД - значит юзер не авторизован
     */
    if (!token_payload || !found_token) {
      throw ApiError.unAuth();
    }

    const { user_name } = token_payload;
    const found_user = await userService.findUser({ user_name });

    await tokenService.removeToken(token);
    const tokens = await tokenService.generateTokens({ user_name });
    await tokenService.saveToken(found_user.id, tokens.refresh_token);

    return tokens;
  }

  validateToken<T>(token: string, secret: string): JwtPayload & T {
    if (!token) {
      throw ApiError.unAuth();
    }
    return verify(token, secret) as JwtPayload & T;
  }

  async generateTokens(payload: Omit<User, 'password'>): Promise<TokenPair> {
    const access_exprires_in = AppConfig.JWT_ACCESS_EXPIRES_IN;
    const refresh_exprires_in = AppConfig.JWT_ACCESS_EXPIRES_IN;

    const access_secret = AppConfig.JWT_ACCESS_TOKEN;
    const refresh_secret = AppConfig.JWT_REFRESH_TOKEN;

    const access_token = this.signToken(payload, access_secret, access_exprires_in);
    const refresh_token = this.signToken(payload, refresh_secret, refresh_exprires_in);

    return {
      access_token,
      refresh_token,
    };
  }

  async removeToken(refresh_token: string) {
    return prisma.token.delete({
      where: {
        refresh_token,
      },
    });
  }

  async saveToken(user_id: string, refresh_token: string): Promise<Token> {
    return prisma.token.create({
      data: {
        refresh_token,
        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });
  }

  signToken(payload: object, secret: string, expiresIn: string) {
    return sign(payload, secret, { expiresIn });
  }
}

export const tokenService = new TokenService();
