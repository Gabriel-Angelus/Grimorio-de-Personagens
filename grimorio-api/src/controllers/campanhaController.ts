import type { Request, Response } from 'express';
import { campanhaService } from '../services/campanhaService.js';

export const campanhaController = {
  listarTodas(req: Request, res: Response): void {
    const campanhas = campanhaService.listarTodas();
    res.json(campanhas);
  },

  buscarPorId(req: Request, res: Response): void {
    const campanha = campanhaService.buscarPorId(Number(req.params.id));
    res.json(campanha);
  },

  criar(req: Request, res: Response): void {
    const campanha = campanhaService.criar(req.body);
    res.status(201).json(campanha);
  },

  atualizar(req: Request, res: Response): void {
    const campanha = campanhaService.atualizar(Number(req.params.id), req.body);
    res.json(campanha);
  },

  remover(req: Request, res: Response): void {
    campanhaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
