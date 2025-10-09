import procductoSchema from '../schemas/producto.js';

class productoModel {
    async createProducto(data) {
        return await procductoSchema.create(data);
    }
    async getAllProductos() {
        return await procductoSchema.find();
    }
    async getProductoById(id) {
        return await procductoSchema.findOne({ _id: id });
    }
    async updateProducto(id, data) {
        return await procductoSchema.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async deleteProducto(id) {
        return await procductoSchema.findOneAndDelete({ _id: id });
    }
}

export default new productoModel();