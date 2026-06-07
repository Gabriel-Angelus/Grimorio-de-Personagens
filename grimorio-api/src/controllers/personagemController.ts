import type { Request, Response } from 'express';
import { personagemService } from '../services/personagemService.js';

export const personagemController = {
  listarTodos(req: Request, res: Response): void {
    const campanhaId = typeof req.query.campanhaId === 'string' ? req.query.campanhaId : undefined;
    const personagens = personagemService.listarTodos(campanhaId);
    res.json(personagens);
  },

  buscarPorId(req: Request, res: Response): void {
    const personagem = personagemService.buscarPorId(Number(req.params.id));
    res.json(personagem);
  },

  criar(req: Request, res: Response): void {
    const personagem = personagemService.criar(req.body);
    res.status(201).json(personagem);
  },

  atualizar(req: Request, res: Response): void {
    const personagem = personagemService.atualizar(Number(req.params.id), req.body);
    res.json(personagem);
  },

  remover(req: Request, res: Response): void {
    personagemService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
