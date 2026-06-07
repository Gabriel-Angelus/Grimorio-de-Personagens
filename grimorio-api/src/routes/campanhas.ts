import { Router } from 'express';
import { campanhaController } from '../controllers/campanhaController.js';

const router = Router();

router.get('/', campanhaController.listarTodas);
router.get('/:id', campanhaController.buscarPorId);
router.post('/', campanhaController.criar);
router.put('/:id', campanhaController.atualizar);
router.delete('/:id', campanhaController.remover);

export default router;
