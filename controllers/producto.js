import productoModel from '../model/producto.js';

class productoController {
    async obtenerProductos(req, res) {
        const productos = await productoModel.getAllProductos();
        res.json(productos);
    }

    async obtenerProductoPorId(req, res) {
        const producto = await productoModel.getProductoById(req.params.id);
        res.json(producto);
    }

    async crearProducto(req, res) {
        const nuevoProducto = await productoModel.createProducto(req.body);
        res.status(201).json(nuevoProducto);
    }

    async actualizarProducto(req, res) {
        const productoActualizado = await productoModel.updateProducto(req.params.id, req.body);
        res.json(productoActualizado);
    }

    async eliminarProducto(req, res) {
        await productoModel.deleteProducto(req.params.id);
        res.status(204).send();
    }
}

export default new productoController();
