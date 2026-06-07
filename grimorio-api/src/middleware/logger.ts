import type { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction): void {
  const hora = new Date().toISOString();
  console.log(`[${hora}] ${req.method} ${req.url}`);
  next();
}
