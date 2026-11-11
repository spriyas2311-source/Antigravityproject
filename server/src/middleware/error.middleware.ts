import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[SERVER EXCEPTION CAUGHT]:', err);

  const status = err.status || err.statusCode || 500;
  const response: any = {
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    error: {
      code: err.code || 'INTERNAL_ERROR'
    }
  };

  if (ENV.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
}

