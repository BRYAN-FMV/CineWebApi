import mongoose from 'mongoose';
import asientoModel from '../model/asientos.js';
import Asiento from '../schemas/asientos.js';
import Sala from '../schemas/sala.js';

class asientoController {
  // Obtener todos los asientos (con sala poblada)
  async obtenerAsientos(req, res) {
    try {
      const asientos = await Asiento.find().populate('salaId');
      return res.status(200).json(asientos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Obtener un asiento por ID (con sala poblada)
  async obtenerAsientoPorId(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      const asiento = await Asiento.findById(id).populate('salaId');
      if (!asiento) return res.status(404).json({ error: 'Asiento no encontrado' });

      return res.status(200).json(asiento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Crear un asiento (valida que la sala exista)
  async crearAsiento(req, res) {
    try {
      const { salaId, fila, numero, estado, codigo } = req.body;

      if (!salaId || !mongoose.Types.ObjectId.isValid(salaId)) {
        return res.status(400).json({ error: 'Se requiere una sala válida (ObjectId)' });
      }
      const salaExists = await Sala.findById(salaId);
      if (!salaExists) return res.status(400).json({ error: 'La sala indicada no existe' });

      const creado = await asientoModel.createAsiento({ salaId, fila, numero, estado, codigo });
      const populated = await Asiento.findById(creado._id).populate('salaId');
      return res.status(201).json(populated);
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({ error: 'Valor duplicado (posible código de asiento repetido).' });
      }
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Actualizar asiento (si cambia sala, valida existencia)
  async actualizarAsiento(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      if (updates.salaId) {
        if (!mongoose.Types.ObjectId.isValid(updates.salaId)) {
          return res.status(400).json({ error: 'salaId inválido' });
        }
        const salaExists = await Sala.findById(updates.salaId);
        if (!salaExists) return res.status(400).json({ error: 'La sala indicada no existe' });
      }

      const updated = await asientoModel.updateAsiento(id, updates);
      if (!updated) return res.status(404).json({ error: 'Asiento no encontrado' });

      const populated = await Asiento.findById(updated._id).populate('salaId');
      return res.status(200).json(populated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Eliminar asiento
  async eliminarAsiento(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      const deleted = await asientoModel.deleteAsiento(id);
      if (!deleted) return res.status(404).json({ error: 'Asiento no encontrado' });

      return res.status(200).json({ message: 'Asiento eliminado', data: deleted });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new asientoController();
