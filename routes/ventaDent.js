import express from 'express';
const route = express.Router();
import ventaDetController from '../controllers/ventaDet.js';

route.get('/', ventaDetController.getAll);
route.get('/:id', ventaDetController.getById);
route.post('/', ventaDetController.create);
route.put('/:id', ventaDetController.update);
route.delete('/:id', ventaDetController.delete);

export default route;
