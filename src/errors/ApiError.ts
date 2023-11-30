export class ApiError extends Error {
  constructor(public statusCode: number, public message: string, public errors = []) {
    super(message);
  }

  static noPermission() {
    return new ApiError(403, 'Forbidden');
  }

  static unAuth() {
    return new ApiError(403, 'No auth');
  }

  static notFound() {
    return new ApiError(404, 'Not Found');
  }

  static badRequest(errors = []) {
    return new ApiError(400, 'Bad Request', errors);
  }
}
