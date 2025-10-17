import Asiento from "../schemas/asientos.js";

class asientoModel {
    async createAsiento(data) {
        return await Asiento.create(data);
    }  
    async getAllAsientos() {
        return await Asiento.find();
    }
    async getAsientoById(id) {
        return await Asiento.findOne({ _id: id });
    }
    async updateAsiento(id, data) {
        return await Asiento.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async deleteAsiento(id) {
        return await Asiento.findOneAndDelete({ _id: id });
    }
}

export default new asientoModel();