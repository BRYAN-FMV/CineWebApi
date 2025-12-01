import express from 'express';
const route = express.Router();
import asientosController from '../controllers/asientos.js';

route.get('/', asientosController.obtenerAsientos);
route.get('/:id', asientosController.obtenerAsientoPorId);
route.post('/', asientosController.crearAsiento);
route.post('/bulk', asientosController.crearAsientosBulk);
route.put('/:id', asientosController.actualizarAsiento);
route.delete('/:id', asientosController.eliminarAsiento);

export default route;