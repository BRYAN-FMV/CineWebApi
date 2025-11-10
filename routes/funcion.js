import express from 'express';
import funcionController from '../controllers/funcion.js';
// import auth from '../middlewares/auth.js'; // descomenta si tienes middleware de auth

const router = express.Router();

// Rutas públicas
router.get('/', funcionController.getAll);
router.get('/:id', funcionController.getById);

// Rutas que requieren autenticación
router.get('/:id/asientos', funcionController.obtenerMapaAsientos); // auth, si tienes middleware
router.post('/', funcionController.create);
router.put('/:id', funcionController.update);
router.delete('/:id', funcionController.delete);

export default router;
