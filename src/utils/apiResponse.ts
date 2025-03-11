export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export class ApiResponseHelper {
  static success<T>(data: T, message?: string, statusCode: number = 200): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
    };
  }

  static error(message: string, statusCode: number = 400): ApiResponse {
    return {
      success: false,
      error: message,
      statusCode,
    };
  }

  static notFound(message: string = 'Resource not found'): ApiResponse {
    return this.error(message, 404);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiResponse {
    return this.error(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): ApiResponse {
    return this.error(message, 403);
  }

  static badRequest(message: string): ApiResponse {
    return this.error(message, 400);
  }

  static serverError(message: string = 'Internal server error'): ApiResponse {
    return this.error(message, 500);
  }
} 