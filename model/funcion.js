import Funcion from '../schemas/funcion.js';

class funcionModel {
    async createFuncion(data) {
        return await Funcion.create(data);
    }
    async getAllFunciones() {
        return await Funcion.find().populate('pelicula').populate('sala');
    }
    async getFuncionById(id) {
        return await Funcion.findOne({ _id: id }).populate('pelicula').populate('sala');
    }
    async updateFuncion(id, data) {
        return await Funcion.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async deleteFuncion(id) {
        return await Funcion.findOneAndDelete({ _id: id });
    }
}

export default new funcionModel();