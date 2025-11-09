import express from 'express';
import funcionController from '../controllers/funcion.js';

const router = express.Router();

router.get('/', funcionController.getAll); 
router.get('/:id', funcionController.getById);
router.post('/', funcionController.create);
router.put('/:id', funcionController.update);
router.delete('/:id', funcionController.delete);

export default router;
