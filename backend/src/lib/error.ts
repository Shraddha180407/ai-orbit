export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
    
    // Capturing stack trace, excluding constructor call from it.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static BadRequest(message: string) {
    return new AppError(400, message);
  }

  static Unauthorized(message: string = 'Unauthorized') {
    return new AppError(401, message);
  }

  static Forbidden(message: string = 'Forbidden') {
    return new AppError(403, message);
  }

  static NotFound(message: string = 'Not Found') {
    return new AppError(404, message);
  }

  static Conflict(message: string) {
    return new AppError(409, message);
  }

  static Internal(message: string = 'Internal Server Error') {
    return new AppError(500, message);
  }
}
