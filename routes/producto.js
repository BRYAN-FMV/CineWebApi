import express from 'express';
const route = express.Router();
import productoController from '../controllers/producto.js';

route.get('/', productoController.obtenerProductos);
route.get('/:id', productoController.obtenerProductoPorId);
route.post('/', productoController.crearProducto);
route.put('/:id', productoController.actualizarProducto);
route.delete('/:id', productoController.eliminarProducto);

export default route;
