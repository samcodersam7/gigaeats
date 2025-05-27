import { ApiResponse, PaginatedResponse, ErrorResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    path?: string,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static error(
    message: string,
    error?: string,
    statusCode?: number,
    path?: string,
    details?: any,
  ): ErrorResponse {
    return {
      success: false,
      message,
      error: error || 'Internal Server Error',
      statusCode: statusCode || 500,
      timestamp: new Date().toISOString(),
      path,
      details,
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success',
    path?: string,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
