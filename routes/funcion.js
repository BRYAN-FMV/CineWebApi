import express from 'express';
const route = express.Router();
import funcionController from '../controllers/funcion.js';

route.post('/', funcionController.create);
route.get('/', funcionController.getAll);
route.get('/:id', funcionController.getById);
route.put('/:id', funcionController.update);
route.delete('/:id', funcionController.delete);

export default route;
