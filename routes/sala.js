import express from 'express';
import salaController from '../controllers/sala.js';

const route = express.Router();

route.get('/', salaController.getAllSalas);
route.get('/:id', salaController.getSalaById);
route.post('/', salaController.addSala); 
route.put('/:id', salaController.updateSala);
route.delete('/:id', salaController.deleteSala);

export default route;