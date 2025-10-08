import express from 'express';
const route = express.Router();
import peliculasController from '../controllers/peliculas.js';

route.get('/', peliculasController.getAllPeliculas);
route.get('/:id', peliculasController.getPeliculaById);
route.post('/', peliculasController.addPelicula);
route.put('/:id', peliculasController.updatePelicula);
route.delete('/:id', peliculasController.deletePelicula);

export default route;