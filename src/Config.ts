export namespace AppConfig {
  export const APP_PORT = process.env.APP_PORT || 3000;

  export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
  export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
  export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
  export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

  /**
   * Время жизни куки будет такое же - как и у токена
   * 30 дней умножаем на 24ч на 60 минут на 60 секунд и на 1000 мс
   */
  export const JWT_REFRESH_TOKEN_COOKIE_LIFETIME =
    Number(JWT_REFRESH_EXPIRES_IN.split(/d|m|s/)[0]) * 24 * 60 * 60 * 1000;
}
