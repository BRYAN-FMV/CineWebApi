import Funcion from '../schemas/funcion.js';

class FuncionModel {
  async createFuncion(data) {
    return await Funcion.create(data);
  }
  async getAll(filter = {}) {
    try {
      return await Funcion.find(filter)
        .populate('pelicula', 'titulo director duracion genero clasificacion poster')
        .populate('sala', 'nombre capacidad tipo')
        .sort({ horario: 1 }) // ordenar por horario ascendente
        .lean();
    } catch (error) {
      throw new Error(`Error al obtener funciones: ${error.message}`);
    }
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

export default new FuncionModel();