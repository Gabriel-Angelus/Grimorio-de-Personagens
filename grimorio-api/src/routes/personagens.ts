import { Router } from 'express';
import { personagemController } from '../controllers/personagemController.js';

const router = Router();

router.get('/', personagemController.listarTodos);
router.get('/:id', personagemController.buscarPorId);
router.post('/', personagemController.criar);
router.put('/:id', personagemController.atualizar);
router.delete('/:id', personagemController.remover);

export default router;
