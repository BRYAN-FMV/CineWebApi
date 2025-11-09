import funcionModel from '../model/funcion.js';
import mongoose from 'mongoose';

class FuncionController {
  // Crear una nueva funcion
  async create(req, res) {
    try {
      const { pelicula, sala, horario, idioma, precio } = req.body;

      // Validar existencia de referencias
      const pel = await Pelicula.findById(pelicula);
      if (!pel) return res.status(400).json({ error: 'Pelicula no existe' });

      const sal = await Sala.findById(sala);
      if (!sal) return res.status(400).json({ error: 'Sala no existe' });

      const nueva = await Funcion.create({ pelicula, sala, horario, idioma, precio });
      const populated = await Funcion.findById(nueva._id).populate('pelicula sala');

      res.status(201).json(populated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la función' });
    }
  }

  // Obtener todas las funciones
  async getAll(req, res) {
    try {
      const { pelicula, sala, fecha, disponibles } = req.query;
      let filter = {};

      // Filtro por película (el que necesitas)
      if (pelicula) {
        if (!mongoose.Types.ObjectId.isValid(pelicula)) {
          return res.status(400).json({ error: 'ID de película inválido' });
        }
        filter.pelicula = pelicula;
      }

      // Otros filtros opcionales
      if (sala) {
        if (!mongoose.Types.ObjectId.isValid(sala)) {
          return res.status(400).json({ error: 'ID de sala inválido' });
        }
        filter.sala = sala;
      }

      if (fecha) {
        const fechaInicio = new Date(fecha);
        const fechaFin = new Date(fecha);
        fechaFin.setDate(fechaFin.getDate() + 1);
        filter.horario = { $gte: fechaInicio, $lt: fechaFin };
      }

      if (disponibles === 'true') {
        filter.horario = { $gte: new Date() };
      }

      const funciones = await funcionModel.getAll(filter);
      return res.status(200).json(funciones);
    } catch (error) {
      console.error('Error en getFunciones:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Obtener una funcion por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Funcion.findById(id).populate('pelicula sala');
      if (!data) return res.status(404).json({ error: 'Función no encontrada' });
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la función' });
    }
  }

  // Actualizar una funcion
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Si vienen referencias nuevas, validar existencia
      if (updates.pelicula) {
        const pel = await Pelicula.findById(updates.pelicula);
        if (!pel) return res.status(400).json({ error: 'Pelicula no existe' });
      }
      if (updates.sala) {
        const sal = await Sala.findById(updates.sala);
        if (!sal) return res.status(400).json({ error: 'Sala no existe' });
      }

      const data = await Funcion.findByIdAndUpdate(id, updates, { new: true }).populate('pelicula sala');
      if (!data) return res.status(404).json({ error: 'Función no encontrada' });
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la función' });
    }
  }

  // Eliminar una funcion
  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await Funcion.findByIdAndDelete(id);
      if (!data) return res.status(404).json({ error: 'Función no encontrada' });
      res.status(200).json({ message: 'Función eliminada', data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la función' });
    }
  }
}

export default new FuncionController();