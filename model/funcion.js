import Funcion from '../schemas/funcion.js';

class FuncionModel {
  // Crear función
  async create(funcionData) {
    try {
      const funcion = new Funcion(funcionData);
      return await funcion.save();
    } catch (error) {
      throw new Error(`Error al crear función: ${error.message}`);
    }
  }

  // Obtener todas las funciones con filtros
  async getAll(filter = {}) {
    try {
      return await Funcion.find(filter)
        .populate('pelicula', 'titulo director duracion genero clasificacion poster')
        .populate('sala', 'nombre capacidad tipo')
        .sort({ horario: 1 })
        .lean();
    } catch (error) {
      throw new Error(`Error al obtener funciones: ${error.message}`);
    }
  }

  // Obtener función por ID
  async getById(id) {
    try {
      return await Funcion.findById(id)
        .populate('pelicula', 'titulo director duracion genero clasificacion sinopsis poster')
        .populate('sala', 'nombre capacidad tipo')
        .lean();
    } catch (error) {
      throw new Error(`Error al obtener función: ${error.message}`);
    }
  }

  // Actualizar función
  async update(id, updateData) {
    try {
      return await Funcion.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      )
      .populate('pelicula', 'titulo director duracion')
      .populate('sala', 'nombre capacidad');
    } catch (error) {
      throw new Error(`Error al actualizar función: ${error.message}`);
    }
  }

  // Eliminar función
  async delete(id) {
    try {
      return await Funcion.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar función: ${error.message}`);
    }
  }

  // Buscar funciones por película
  async getByPelicula(peliculaId) {
    try {
      return await Funcion.find({ pelicula: peliculaId })
        .populate('sala', 'nombre capacidad tipo')
        .sort({ horario: 1 })
        .lean();
    } catch (error) {
      throw new Error(`Error al obtener funciones por película: ${error.message}`);
    }
  }

  // Buscar funciones disponibles (futuras)
  async getDisponibles() {
    try {
      return await Funcion.find({ 
        horario: { $gte: new Date() } 
      })
      .populate('pelicula', 'titulo director duracion')
      .populate('sala', 'nombre capacidad tipo')
      .sort({ horario: 1 })
      .lean();
    } catch (error) {
      throw new Error(`Error al obtener funciones disponibles: ${error.message}`);
    }
  }
}

export default new FuncionModel();