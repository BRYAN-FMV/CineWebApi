import express from 'express';
const route = express.Router();
import { verificarToken } from '../helpers/autenticacion.js';
import ventaEncController from '../controllers/ventaEnc.js';

route.post('/', verificarToken, ventaEncController.createVentaEnc);
route.get('/', verificarToken, ventaEncController.getAllVentaEnc);
route.get('/:id', verificarToken, ventaEncController.getVentaEncById);
route.put('/:id', verificarToken, ventaEncController.updateVentaEnc);
route.delete('/:id', verificarToken, ventaEncController.deleteVentaEnc);

export default route;
