import ventaDet from '../schemas/ventaDet.js';

class VentaDetModel {
    async createVentaDet(data) {
        return await ventaDet.create(data);
    }

    async getAllVentaDet() {
        return await ventaDet.find();
    }

    async getVentaDetById(id) {
        return await ventaDet.findById(id);
    }

    async updateVentaDet(id, data) {
        return await ventaDet.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteVentaDet(id) {
        return await ventaDet.findByIdAndDelete(id);
    }

    async findByVentaEnc(ventaEncId) {
        return await ventaDet.find({ ventaEnc: ventaEncId });
    }

    async findByFuncionAndAsiento(funcionId, asientoId) {
        return await ventaDet.findOne({ funcion: funcionId, asientoId: asientoId });
    }
}

export default new VentaDetModel();