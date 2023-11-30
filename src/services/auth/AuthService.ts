import { ApiError } from '@errors';
import { userService } from '@services/user';
import { compareSync, hash } from 'bcrypt';
import { User } from 'libs/interfaces';
import { Response } from 'express';
import { GatewayContract } from '@contracts';
import { AppConfig } from '@Config';
import { tokenService } from './TokenService';

class AuthService {
  comparePassword(password: string, hashed_password: string): boolean {
    return compareSync(password, hashed_password);
  }

  async hashPassword(password: string, salt: number): Promise<string> {
    return hash(password, salt);
  }

  async register(res: Response, user: User) {
    const created_user = await userService.createUser(user);

    const generated_tokens = await tokenService.generateTokens({
      user_name: created_user.user_name,
    });

    const created_token = await tokenService.saveToken(
      created_user.id,
      generated_tokens.refresh_token,
    );

    this.setRefreshTokenInCookie(res, created_token.refresh_token);

    return {
      refresh_token: created_token.refresh_token,
      created_user,
    };
  }

  async login(res: Response, user: User) {
    const found_user = await userService.findUser({ user_name: user.user_name });
    if (!found_user) {
      throw ApiError.badRequest(['Неверный логин или пароль']);
    }

    const password_is_valid = this.comparePassword(
      user.password,
      found_user.hashed_password,
    );

    if (!password_is_valid) {
      throw ApiError.badRequest(['Пароль неверный']);
    }

    const tokens = await tokenService.generateTokens({
      user_name: found_user.user_name,
    });

    await tokenService.saveToken(found_user.id, tokens.refresh_token);
    this.setRefreshTokenInCookie(res, tokens.refresh_token);

    return {
      tokens,
      is_logined: true,
    };
  }

  setRefreshTokenInCookie(res: Response, refresh_token: string): void {
    res.cookie(GatewayContract.REFRESH_TOKEN_FOR_COOKIE, refresh_token, {
      maxAge: AppConfig.JWT_REFRESH_TOKEN_COOKIE_LIFETIME,
      httpOnly: true,
      secure: process.env.NODE == 'prod',
    });
  }

  removeRefreshTokenFromCookie(res: Response): void {
    res.clearCookie(GatewayContract.REFRESH_TOKEN_FOR_COOKIE);
  }
}

export const authService = new AuthService();
