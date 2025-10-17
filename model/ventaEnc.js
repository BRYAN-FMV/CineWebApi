import VentaEnc from '../schemas/ventaEnc.js';

class VentaEncModel {
    async createVentaEnc(data) {
        return await VentaEnc.create(data);
    }
    async getAllVentaEnc() {
        return await VentaEnc.find();
    }
    async getVentaEncById(id) {
        return await VentaEnc.findOne({ _id: id });
    }
    async updateVentaEnc(id, data) {
        return await VentaEnc.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async deleteVentaEnc(id) {
        return await VentaEnc.findOneAndDelete({ _id: id });
    }

};

export default new VentaEncModel();
