import express from 'express';
import ReservaController from '../controllers/reserva.js';
import { verificarToken } from '../helpers/autenticacion.js';

const route = express.Router();

route.post('/', ReservaController.create);
route.delete('/:id', ReservaController.cancel);
route.get('/me', ReservaController.listByUser);

export default route;