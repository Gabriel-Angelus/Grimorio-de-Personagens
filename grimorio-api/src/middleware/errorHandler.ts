import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../types/httpError.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(`[${req.method} ${req.url}] ${err.message}`);

  const status = err instanceof HttpError ? err.status : 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor',
  });
};
